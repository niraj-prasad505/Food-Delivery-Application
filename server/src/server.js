require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");

// Existing Routes
const userRouter = require("./routes/userRouter");
const ownerRouter = require("./routes/ownerRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const cartRoutes = require("./routes/userCartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");

// Admin Routes
const adminDashboardRoutes = require("./routes/adminDashboardRoutes");
const AdminShopRoutes = require("./routes/adminShopRoutes");
const adminProductRoutes = require("./routes/adminProductRoutes");
const adminOrderRoutes = require("./routes/adminOrderRoutes");




// New Public Customer Routes
const shopRoutes = require("./routes/shopRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

connectDB();

// Middleware

app.use(
    cors({
        origin: [
            "http://localhost:5173", // Customer
            "http://localhost:5174", // Admin
        ],
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

// Basic Routes

app.get("/", (req, res) => {
    res.send("Food Delivery API is running!");
});

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Food Delivery API is working",
    });
});

// User Routes

app.use("/api/users", userRouter);

// Owner Routes

app.use("/api/owner-auth", ownerRouter);

// Review Routes

app.use("/api/reviews", reviewRoutes);

// Owner Shop Management

app.use("/api/owner/shops", AdminShopRoutes);
app.use("/api/owner/products", adminProductRoutes);
app.use("/api/owner/orders", adminOrderRoutes);

// Cart & Wishlist

app.use("/api/cart", cartRoutes);

app.use("/api/wishlist", wishlistRoutes);

// Admin Routes

app.use("/api/admin", adminDashboardRoutes);

// Public Customer Routes

app.use("/api/shops", shopRoutes);

app.use("/api/foods", productRoutes);

// Start Server

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});