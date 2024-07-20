const User = require("../models/userModel");
const {
  registerUser,
  updateUserProfile,
  deleteUserAccount,
  getUserById,
} = require("../controllers/userController");

// Mock the User model
jest.mock("../models/userModel");

describe("User Controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("registerUser", () => {
    it("should return 400 if user already exists", async () => {
      User.findOne.mockResolvedValue({ email: "test@test.com" });
      req.body = {
        username: "test",
        email: "test@test.com",
        password: "123456",
      };

      await registerUser(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({ email: "test@test.com" });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "User already exists" });
    });

    it("should register a new user", async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({
        _id: "userId",
        username: "test",
        email: "test@test.com",
        password: "123456",
      });
      req.body = {
        username: "test",
        email: "test@test.com",
        password: "123456",
      };

      await registerUser(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({ email: "test@test.com" });
      expect(User.create).toHaveBeenCalledWith({
        username: "test",
        email: "test@test.com",
        password: "123456",
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        _id: "userId",
        username: "test",
        email: "test@test.com",
      });
    });

    it("should handle invalid user data", async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue(null);
      req.body = {
        username: "test",
        email: "test@test.com",
        password: "123456",
      };

      await registerUser(req, res, next);

      expect(User.create).toHaveBeenCalledWith({
        username: "test",
        email: "test@test.com",
        password: "123456",
      });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid user data" });
    });
  });

  describe("updateUserProfile", () => {
    it("should return 404 if user is not found", async () => {
      User.findById.mockResolvedValue(null);
      req.params.userId = "userId";
      req.body = { username: "newUsername", email: "new@test.com" };

      await updateUserProfile(req, res, next);

      expect(User.findById).toHaveBeenCalledWith("userId");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("should update user profile", async () => {
      const user = {
        _id: "userId",
        username: "oldUsername",
        email: "old@test.com",
        save: jest.fn().mockResolvedValue({
          _id: "userId",
          username: "newUsername",
          email: "new@test.com",
        }),
      };
      User.findById.mockResolvedValue(user);
      req.params.userId = "userId";
      req.body = { username: "newUsername", email: "new@test.com" };

      await updateUserProfile(req, res, next);

      expect(User.findById).toHaveBeenCalledWith("userId");
      expect(user.username).toBe("newUsername");
      expect(user.email).toBe("new@test.com");
      expect(user.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        _id: "userId",
        username: "newUsername",
        email: "new@test.com",
      });
    });
  });

  describe("deleteUserAccount", () => {
    it("should return 404 if user is not found", async () => {
      User.findById.mockResolvedValue(null);
      req.params.userId = "userId";

      await deleteUserAccount(req, res, next);

      expect(User.findById).toHaveBeenCalledWith("userId");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("should delete the user account", async () => {
      const user = {
        _id: "userId",
        remove: jest.fn().mockResolvedValue({}),
      };
      User.findById.mockResolvedValue(user);
      req.params.userId = "userId";

      await deleteUserAccount(req, res, next);

      expect(User.findById).toHaveBeenCalledWith("userId");
      expect(user.remove).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        message: "User account deleted successfully",
      });
    });
  });

  describe("getUserById", () => {
    it("should return 404 if user is not found", async () => {
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });
      req.params.userId = "userId";

      await getUserById(req, res, next);

      expect(User.findById).toHaveBeenCalledWith("userId");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("should return user details excluding password", async () => {
      const user = {
        _id: "userId",
        username: "test",
        email: "test@test.com",
        select: (_) =>
          jest.fn().mockResolvedValue({
            _id: "userId",
            username: "test",
            email: "test@test.com",
          }),
      };
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(user),
      });
      req.params.userId = "userId";

      await getUserById(req, res, next);

      expect(User.findById).toHaveBeenCalledWith("userId");
      expect(User.findById().select).toHaveBeenCalledWith("-password");
      expect(res.json).toHaveBeenCalledWith({
        _id: "userId",
        username: "test",
        email: "test@test.com",
      });
    });
  });
});
