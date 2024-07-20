const request = require("supertest");
const app = require("../app");
const Media = require("../models/mediaModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

// Mock Media model methods
jest.mock("../models/mediaModel");
jest.mock("../models/userModel");
jest.mock("../models/commentModel");

describe("Media Management API", () => {
  let server;

  beforeAll(async () => {
    server = app.listen(5002);
  });

  afterAll(async () => {
    await server.close();
  });

  describe("Upload Media", () => {
    it("should upload media", async () => {
      const token = jwt.sign(
        { id: "507f191e810c19729de860ea" },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );

      Media.create.mockResolvedValue({
        _id: "507f191e810c19729de860eb",
        userId: "507f191e810c19729de860ea",
        mediaURL: "uploads/test.jpg",
        description: "Test description",
      });

      const res = await request(server)
        .post("/api/media")
        .set("Authorization", `Bearer ${token}`)
        .field("description", "Test description")
        .attach("mediaFile", path.join(__dirname, "test.jpg"));

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("mediaId");
      expect(res.body).toHaveProperty("mediaURL", "uploads/test.jpg");
      expect(res.body).toHaveProperty("description", "Test description");
    });
  });

  describe("Delete Media", () => {
    it("should delete media", async () => {
      const token = jwt.sign(
        { id: "507f191e810c19729de860ea" },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );

      Media.findById.mockResolvedValue({
        _id: "507f191e810c19729de860eb",
        userId: "507f191e810c19729de860ea",
        remove: jest.fn().mockResolvedValue({}),
      });

      const res = await request(server)
        .delete("/api/media/507f191e810c19729de860eb")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("message", "Media deleted successfully");
    });

    it("should return 401 if user not authorized", async () => {
      const token = jwt.sign(
        { id: "507f191e810c19729de860ea" },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );

      Media.findById.mockResolvedValue({
        _id: "507f191e810c19729de860eb",
        userId: "507f191e810c19729de860ec",
      });

      const res = await request(server)
        .delete("/api/media/507f191e810c19729de860eb")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty("message", "User not authorized");
    });

    it("should return 404 if media not found", async () => {
      const token = jwt.sign(
        { id: "507f191e810c19729de860ea" },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );

      Media.findById.mockResolvedValue(null);

      const res = await request(server)
        .delete("/api/media/507f191e810c19729de860eb")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty("message", "Media not found");
    });
  });

  describe("Like Media", () => {
    it("should like media", async () => {
      const token = jwt.sign(
        { id: "507f191e810c19729de860ea" },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );

      Media.findById.mockResolvedValue({
        _id: "507f191e810c19729de860eb",
        userId: "507f191e810c19729de860ea",
        likes: [],
        save: jest.fn().mockResolvedValue({
          _id: "507f191e810c19729de860eb",
          likes: ["507f191e810c19729de860ea"],
        }),
      });

      const res = await request(server)
        .post("/api/media/507f191e810c19729de860eb/like")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("mediaId");
      expect(res.body).toHaveProperty("likesCount", 1);
    });

    it("should return 400 if media already liked", async () => {
      const token = jwt.sign(
        { id: "507f191e810c19729de860ea" },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );

      Media.findById.mockResolvedValue({
        _id: "507f191e810c19729de860eb",
        userId: "507f191e810c19729de860ea",
        likes: ["507f191e810c19729de860ea"],
      });

      const res = await request(server)
        .post("/api/media/507f191e810c19729de860eb/like")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("message", "Media already liked");
    });

    it("should return 404 if media not found", async () => {
      const token = jwt.sign(
        { id: "507f191e810c19729de860ea" },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );

      Media.findById.mockResolvedValue(null);

      const res = await request(server)
        .post("/api/media/507f191e810c19729de860eb/like")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty("message", "Media not found");
    });
  });

  describe("Comment on Media", () => {
    it("should comment on media", async () => {
      const token = jwt.sign(
        { id: "507f191e810c19729de860ea" },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );

      Media.findById.mockResolvedValue({
        _id: "507f191e810c19729de860eb",
        userId: "507f191e810c19729de860ea",
        comments: [],
        save: jest.fn().mockResolvedValue({
          _id: "507f191e810c19729de860eb",
          comments: ["507f191e810c19729de860ec"],
        }),
      });

      Comment.create.mockResolvedValue({
        _id: "507f191e810c19729de860ec",
        userId: "507f191e810c19729de860ea",
        mediaId: "507f191e810c19729de860eb",
        comment: "Nice post!",
      });

      const res = await request(server)
        .post("/api/media/507f191e810c19729de860eb/comment")
        .set("Authorization", `Bearer ${token}`)
        .send({ comment: "Nice post!" });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("commentId");
      expect(res.body).toHaveProperty("comment", "Nice post!");
    });

    it("should return 404 if media not found", async () => {
      const token = jwt.sign(
        { id: "507f191e810c19729de860ea" },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );

      Media.findById.mockResolvedValue(null);

      const res = await request(server)
        .post("/api/media/507f191e810c19729de860eb/comment")
        .set("Authorization", `Bearer ${token}`)
        .send({ comment: "Nice post!" });

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty("message", "Media not found");
    });
  });
});
