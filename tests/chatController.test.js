const request = require("supertest");
const app = require("../app");
const Message = require("../models/messageModel");
const jwt = require("jsonwebtoken");

// Mock Message model methods
jest.mock("../models/messageModel");

describe("Chat API", () => {
  let server;

  beforeAll(async () => {
    server = app.listen(5002);
  });

  afterAll(async () => {
    await server.close();
  });

  describe("Send Message", () => {
    it("should send a message", async () => {
      const token = jwt.sign(
        { id: "507f191e810c19729de860ea" },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );

      Message.create.mockResolvedValue({
        _id: "507f191e810c19729de860eb",
        senderId: "507f191e810c19729de860ea",
        receiverId: "507f191e810c19729de860eb",
        message: "Hello!",
      });

      const res = await request(server)
        .post("/api/chat")
        .set("Authorization", `Bearer ${token}`)
        .send({ receiverId: "507f191e810c19729de860eb", message: "Hello!" });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("message", "Hello!");
    });

    it("should return 400 if receiverId or message is missing", async () => {
      const token = jwt.sign(
        { id: "507f191e810c19729de860ea" },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );

      const res = await request(server)
        .post("/api/chat")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "Hello!" });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty(
        "message",
        "Receiver ID and message are required"
      );
    });

    it("should return 500 if there is an error", async () => {
      const token = jwt.sign(
        { id: "507f191e810c19729de860ea" },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );

      Message.create.mockRejectedValue(new Error("Database error"));

      const res = await request(server)
        .post("/api/chat")
        .set("Authorization", `Bearer ${token}`)
        .send({ receiverId: "507f191e810c19729de860eb", message: "Hello!" });

      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty("message", "Failed to send message");
    });
  });
});
