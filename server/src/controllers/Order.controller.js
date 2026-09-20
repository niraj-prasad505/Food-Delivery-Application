const Razorpay = require("razorpay");
const crypto = require("crypto");
const mongoose = require("mongoose");
const Order = require("../models/Order.model");
const Product = require("../models/Product-model");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Robust Helper: resolves Shop ID from payload or automatically queries the database
const resolveShopId = async (shop, items) => {
  // Check direct shop payload
  let candidate = shop?._id || shop;

  // Check items array
  if (!candidate && items?.length > 0) {
    candidate = items[0]?.shop?._id || items[0]?.shop || items[0]?.product?.shop;
  }

  if (candidate && mongoose.Types.ObjectId.isValid(candidate)) {
    return candidate;
  }

  // Fallback: If shop wasn't sent, lookup the first product from MongoDB
  const firstProductId = items?.[0]?.product?._id || items?.[0]?.product;
  if (firstProductId && mongoose.Types.ObjectId.isValid(firstProductId)) {
    const dbProduct = await Product.findById(firstProductId).select("shop");
    if (dbProduct && dbProduct.shop) {
      return dbProduct.shop;
    }
  }

  return null;
};

// 1. PLACE CASH ON DELIVERY (COD) ORDER
exports.createOrder = async (req, res) => {
  try {
    const {
      items,
      deliveryAddress,
      paymentMethod,
      subtotal,
      deliveryFee,
      totalAmount,
      shop,
    } = req.body;

    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const shopId = await resolveShopId(shop, items);

    const newOrder = new Order({
      user: userId,
      shop: shopId,
      items,
      deliveryAddress,
      paymentMethod: paymentMethod || "cod",
      paymentStatus: paymentMethod === "online" ? "Paid" : "Pending",
      status: "Order Placed",
      subtotal,
      deliveryFee: deliveryFee || 0,
      totalAmount,
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. GENERATE RAZORPAY ORDER ID
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid order amount" });
    }

    const options = {
      amount: Math.round(Number(amount) * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order: razorpayOrder,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Create Razorpay Order Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. VERIFY PAYMENT SIGNATURE & SAVE ORDER
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      deliveryAddress,
      subtotal,
      deliveryFee,
      totalAmount,
      shop,
    } = req.body;

    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed. Invalid signature.",
      });
    }

    const shopId = await resolveShopId(shop, items);

    let existingOrder = await Order.findOne({ razorpayOrderId: razorpay_order_id });

    if (existingOrder) {
      existingOrder.paymentStatus = "Paid";
      existingOrder.razorpayPaymentId = razorpay_payment_id;
      if (!existingOrder.shop && shopId) existingOrder.shop = shopId;
      await existingOrder.save();

      return res.status(200).json({
        success: true,
        message: "Payment verified and order updated",
        order: existingOrder,
      });
    }

    const newOrder = new Order({
      user: userId,
      shop: shopId,
      items,
      deliveryAddress,
      paymentMethod: "online",
      paymentStatus: "Paid",
      status: "Order Placed",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      subtotal,
      deliveryFee: deliveryFee || 0,
      totalAmount,
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: "Payment verified and order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Verify Payment Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. FETCH LOGGED-IN CUSTOMER'S ORDERS
exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;

    const orders = await Order.find({ user: userId })
      .populate("shop", "name city phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get My Orders Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. RAZORPAY WEBHOOK LISTENER
exports.handleRazorpayWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const razorpaySignature = req.headers["x-razorpay-signature"];

    const payloadBody = req.rawBody || JSON.stringify(req.body);

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(payloadBody)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ success: false, message: "Invalid webhook signature" });
    }

    const { event, payload } = req.body;

    if (event === "payment.captured") {
      const payment = payload.payment.entity;
      const razorpayOrderId = payment.order_id;

      await Order.findOneAndUpdate(
        { razorpayOrderId },
        {
          paymentStatus: "Paid",
          razorpayPaymentId: payment.id,
        }
      );
      console.log(`[Webhook] Order ${razorpayOrderId} confirmed as Paid`);
    }

    if (event === "payment.failed") {
      const payment = payload.payment.entity;
      const razorpayOrderId = payment.order_id;

      await Order.findOneAndUpdate(
        { razorpayOrderId },
        {
          paymentStatus: "Failed",
          status: "Cancelled",
        }
      );
      console.log(`[Webhook] Order ${razorpayOrderId} marked as Failed`);
    }

    res.status(200).json({ status: "ok" });
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(500).json({ success: false, message: "Webhook handler error" });
  }
};