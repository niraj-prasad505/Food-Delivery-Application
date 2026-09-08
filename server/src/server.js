require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");
const userRouter = require("./routes/userRouter");
const ownerRouter = require("./routes/ownerRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const ownershopRoutes = require("./routes/ownerShopRoutes");



const app = express();

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("Food Delivery API is running!");
});

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Food Delivery API is working"
    });
});

app.use("/api/users", userRouter);

app.use("/api/owners", ownerRouter);

app.use("/api/reviews", reviewRoutes);

app.use("/api/shops", ownershopRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});