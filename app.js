const express = require("express");
const connectDB = require("./config/db");

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/media", require("./routes/mediaRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));

module.exports = app;
