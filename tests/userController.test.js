const request = require("supertest");
const app = require("../app");
const User = require("../models/userModel");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// Mock User model methods
jest.mock("../models/userModel");

describe("User Management API", () => {
  let server;

  beforeAll(async () => {
    server = app.listen(5001);
  });

  afterAll(async () => {
    await server.close();
  });

  describe("User Registration", () => {
    it("should register a new user", async () => {
      User.create.mockResolvedValue({
        _id: "507f191e810c19729de860ea",
        username: "testuser",
        email: "test@example.com",
      });

      const res = await request(server)
        .post("/api/users/register")
        .send({
          username: "testuser",
          email: "test@example.com",
          password: "password",
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("username", "testuser");
      expect(res.body).toHaveProperty("email", "test@example.com");
    });
  });

  describe("Update User Profile", () => {
    it("should update user profile", async () => {
      const token = jwt.sign(
        { id: "507f191e810c19729de860ea" },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );

      User.findById.mockResolvedValue({
        _id: "507f191e810c19729de860ea",
        username: "testuser",
        email: "test@example.com",
        save: jest.fn().mockResolvedValue({
          _id: "507f191e810c19729de860ea",
          username: "updateduser",
          email: "updated@example.com",
        }),
      });

      const res = await request(server)
        .put("/api/users/507f191e810c19729de860ea")
        .set("Authorization", `Bearer ${token}`)
        .send({ username: "updateduser", email: "updated@example.com" });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("username", "updateduser");
      expect(res.body).toHaveProperty("email", "updated@example.com");
    });
  });

  describe("Delete User Account", () => {
    it("should delete user account", async () => {
      const token = jwt.sign(
        { id: "507f191e810c19729de860ea" },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );

      User.findById.mockResolvedValue({
        _id: "507f191e810c19729de860ea",
        username: "testuser",
        email: "test@example.com",
        remove: jest.fn().mockResolvedValue({}),
      });

      const res = await request(server)
        .delete("/api/users/507f191e810c19729de860ea")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty(
        "message",
        "User account deleted successfully"
      );
    });
  });

  describe("Get User by UserId", () => {
    it("should get user by userId", async () => {
      User.findById.mockResolvedValue({
        _id: "507f191e810c19729de860ea",
        username: "testuser",
        email: "test@example.com",
      });

      const res = await request(server).get(
        "/api/users/507f191e810c19729de860ea"
      );

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("_id", "507f191e810c19729de860ea");
      expect(res.body).toHaveProperty("username", "testuser");
      expect(res.body).toHaveProperty("email", "test@example.com");
    });
  });
});
