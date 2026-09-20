const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order.model");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 1. Place Cash on Delivery Order
exports.createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, paymentMethod, subtotal, deliveryFee, totalAmount } = req.body;

    const newOrder = new Order({
      user: req.user._id,
      items,
      deliveryAddress,
      paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "Pending" : "Paid",
      subtotal,
      deliveryFee,
      totalAmount,
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Generate Razorpay Order ID
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: Math.round(amount * 100), // Razorpay calculates in paise (1 INR = 100 paise)
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order: razorpayOrder,
      key: process.env.RAZORPAY_KEY_ID, // Send key to frontend dynamically
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Verify Payment Signature & Save Order
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
    } = req.body;

    // Mathematical signature verification
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

    // Save genuine order into database
    const newOrder = new Order({
      user: req.user._id,
      items,
      deliveryAddress,
      paymentMethod: "online",
      paymentStatus: "Paid",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      subtotal,
      deliveryFee,
      totalAmount,
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: "Payment verified and order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Fetch User Orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add this to your controllers/Order.controller.js
exports.handleRazorpayWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const razorpaySignature = req.headers["x-razorpay-signature"];

    // 1. Verify signature using raw body buffer
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(req.rawBody)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ message: "Invalid webhook signature" });
    }

    // 2. Extract event data
    const { event, payload } = req.body;

    // Case A: Payment was successful
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
      console.log(`[Webhook] Order ${razorpayOrderId} marked as Paid`);
    }

    // Case B: Payment failed (card declined, incorrect OTP, user cancelled)
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

    // 3. Always return HTTP 200 so Razorpay stops retrying
    res.status(200).json({ status: "ok" });
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(500).json({ message: "Webhook handler failed" });
  }
};