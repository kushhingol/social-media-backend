const Message = require("../models/messageModel");

/**
 * @desc Send a message
 * @route POST /chat
 * @access Private
 */
const sendMessage = async (req, res) => {
  const { receiverId, message } = req.body;

  if (!receiverId || !message) {
    res.status(400).json({ message: "Receiver ID and message are required" });
    return;
  }

  const newMessage = await Message.create({
    senderId: req.user._id,
    receiverId,
    message,
  });

  res.status(201).json(newMessage);
};

/**
 * @desc get  message
 * @route GET /chat/message/:userId
 * @access Private
 */
const getMessages = async (req, res) => {
  const { userId } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.user._id, receiverId: userId },
        { senderId: userId, receiverId: req.user._id },
      ],
    }).sort({ createdAt: -1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving messages" });
  }
};

module.exports = {
  sendMessage,
  getMessages,
};
