require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");

const userRouter = require("./routes/userRouter");
const ownerRouter = require("./routes/ownerRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const ownershopRoutes = require("./routes/ownerShopRoutes");
const cartRoutes = require("./routes/userCartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");

// Admin
const adminDashboardRoutes = require("./routes/adminDashboardRoutes");

const app = express();

connectDB();



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

// --------------------
// Basic Routes
// --------------------

app.get("/", (req, res) => {
    res.send("Food Delivery API is running!");
});

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Food Delivery API is working",
    });
});

// --------------------
// Application Routes
// --------------------

app.use("/api/users", userRouter);

app.use("/api/owner-auth", ownerRouter);

app.use("/api/reviews", reviewRoutes);

app.use("/api/shops", ownershopRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/wishlist", wishlistRoutes);

// --------------------
// Admin Routes
// --------------------

app.use("/api/admin", adminDashboardRoutes);

// --------------------
// Start Server
// --------------------

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});