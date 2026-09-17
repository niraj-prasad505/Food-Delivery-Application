const mongoose = require("mongoose");
const Product = require("../models/Product-model");
const Shop = require("../models/Shop-model");

// Helper to safely extract owner ID from token payload
const getOwnerId = (req) =>
  req.owner?._id || req.owner?.id || req.owner?.ownerId || (typeof req.owner === "string" ? req.owner : null);

// ==========================================
// CREATE NEW PRODUCT
// ==========================================
const createProduct = async (req, res) => {
  try {
    const ownerId = getOwnerId(req);

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Owner identity not verified",
      });
    }

    const {
      shop: shopId,
      name,
      images,
      price,
      originalPrice,
      discount,
      description,
      longDescription,
      category,
      cuisine,
      ingredients,
      deliveryTime,
      stock,
      isTrending,
      bgcolor,
    } = req.body;

    if (!shopId || !name || !price || !category || !description) {
      return res.status(400).json({
        success: false,
        message: "Shop ID, product name, price, category, and description are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(shopId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid shop ID provided",
      });
    }

    // Verify shop belongs to the logged-in owner
    const shop = await Shop.findOne({
      _id: shopId,
      owner: ownerId,
      deletedAt: null,
    });

    if (!shop) {
      return res.status(403).json({
        success: false,
        message: "You can only add products to your own active shops",
      });
    }

    // Calculate discount percentage if original price is supplied
    let computedDiscount = discount || 0;
    if (originalPrice && originalPrice > price && !discount) {
      computedDiscount = Math.round(((originalPrice - price) / originalPrice) * 100);
    }

    const product = await Product.create({
      shop: shopId,
      restaurant: shop.name,
      name: name.trim(),
      images: Array.isArray(images) && images.length > 0 ? images : ["https://placehold.co/400x300?text=Food+Item"],
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : Number(price),
      discount: computedDiscount,
      description: description.trim(),
      longDescription: longDescription ? longDescription.trim() : "",
      category: category.trim(),
      cuisine: cuisine ? cuisine.trim() : "General",
      ingredients: ingredients ? ingredients.trim() : "",
      deliveryTime: deliveryTime || "20–30 min",
      stock: stock !== undefined ? Number(stock) : 50,
      isTrending: Boolean(isTrending),
      bgcolor: bgcolor || "#ffffff",
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};

// ==========================================
// GET ALL PRODUCTS (FOR LOGGED-IN OWNER)
// ==========================================
const getMyProducts = async (req, res) => {
  try {
    const ownerId = getOwnerId(req);

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid session",
      });
    }

    // 1. Get all shops owned by owner
    const ownedShops = await Shop.find({
      owner: ownerId,
      deletedAt: null,
    }).select("_id");

    const shopIds = ownedShops.map((s) => s._id);

    if (shopIds.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        products: [],
      });
    }

    // 2. Optional query filters
    const { shopId, category, search } = req.query;
    const filter = { shop: { $in: shopIds } };

    if (shopId && mongoose.Types.ObjectId.isValid(shopId)) {
      filter.shop = shopId;
    }

    if (category && category !== "All") {
      filter.category = category;
    }

    if (search) {
      filter.name = { $regex: search.trim(), $options: "i" };
    }

    const products = await Product.find(filter)
      .populate("shop", "name city")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get products error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

// ==========================================
// GET SINGLE PRODUCT BY ID
// ==========================================
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const ownerId = getOwnerId(req);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format",
      });
    }

    const product = await Product.findById(id).populate("shop", "name city owner");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check ownership
    if (product.shop?.owner?.toString() !== ownerId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access to this product",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get product error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve product",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE PRODUCT
// ==========================================
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const ownerId = getOwnerId(req);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format",
      });
    }

    const existingProduct = await Product.findById(id).populate("shop", "owner");

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Verify product belongs to an outlet owned by the caller
    if (existingProduct.shop?.owner?.toString() !== ownerId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You do not own the outlet this item belongs to",
      });
    }

    const {
      name,
      images,
      price,
      originalPrice,
      discount,
      description,
      longDescription,
      category,
      cuisine,
      ingredients,
      deliveryTime,
      stock,
      isTrending,
      bgcolor,
    } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (images !== undefined) updateData.images = Array.isArray(images) ? images : [images];
    if (price !== undefined) updateData.price = Number(price);
    if (originalPrice !== undefined) updateData.originalPrice = Number(originalPrice);
    if (discount !== undefined) updateData.discount = Number(discount);
    if (description !== undefined) updateData.description = description.trim();
    if (longDescription !== undefined) updateData.longDescription = longDescription.trim();
    if (category !== undefined) updateData.category = category.trim();
    if (cuisine !== undefined) updateData.cuisine = cuisine.trim();
    if (ingredients !== undefined) updateData.ingredients = ingredients.trim();
    if (deliveryTime !== undefined) updateData.deliveryTime = deliveryTime.trim();
    if (stock !== undefined) updateData.stock = Number(stock);
    if (isTrending !== undefined) updateData.isTrending = Boolean(isTrending);
    if (bgcolor !== undefined) updateData.bgcolor = bgcolor;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      { returnDocument: "after", runValidators: true }
    ).populate("shop", "name city");

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update product error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};

// ==========================================
// DELETE PRODUCT
// ==========================================
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const ownerId = getOwnerId(req);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format",
      });
    }

    const product = await Product.findById(id).populate("shop", "owner");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.shop?.owner?.toString() !== ownerId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You do not own this product",
      });
    }

    await Product.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Product removed successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getMyProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};