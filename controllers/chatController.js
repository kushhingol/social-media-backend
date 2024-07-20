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

module.exports = {
  sendMessage,
};
