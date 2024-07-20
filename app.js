const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/media", require("./routes/mediaRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));

module.exports = app;
