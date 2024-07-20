const express = require("express");
const router = express.Router();
const { sendMessage } = require("../controllers/chatController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, sendMessage);

module.exports = router;
