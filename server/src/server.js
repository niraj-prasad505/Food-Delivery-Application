require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");
const userRouter = require("./routes/userRouter");

const app = express();

connectDB();

app.use(express.json());
app.use(cookieParser());

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

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});