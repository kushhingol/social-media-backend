const express = require("express");
const router = express.Router();
const { sendMessage, getMessages } = require("../controllers/chatController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, sendMessage);
router.get("/message/:userId", authMiddleware, getMessages);

module.exports = router;
