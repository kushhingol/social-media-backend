const socketIo = require("socket.io");
const http = require("http");
const Message = require("./models/messageModel");

const initSocket = (server) => {
  const io = socketIo(server);

  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("join", (userId) => {
      socket.join(userId);
    });

    socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
      try {
        const newMessage = await Message.create({
          senderId,
          receiverId,
          message,
        });
        io.to(receiverId).emit("message", newMessage);
        io.to(senderId).emit("message", newMessage);
      } catch (err) {
        console.error("Error sending message:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  return io;
};

module.exports = initSocket;
