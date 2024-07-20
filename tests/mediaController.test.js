const {
  uploadMedia,
  deleteMedia,
  likeMedia,
  commentOnMedia,
} = require("../controllers/mediaController");
const Media = require("../models/mediaModel");
const Comment = require("../models/commentModel");
const path = require("path");

// Mock dependencies
jest.mock("../models/mediaModel");
jest.mock("../models/commentModel");

describe("Media Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("uploadMedia", () => {
    it("should upload media successfully", async () => {
      const req = {
        body: { description: "Test Media Description" },
        file: { filename: "test.jpg" },
        user: { _id: "userId" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      Media.create.mockResolvedValue({
        _id: "mediaId",
        userId: "userId",
        mediaURL: "uploads/test.jpg",
        description: "Test Media Description",
      });

      await uploadMedia(req, res);

      expect(Media.create).toHaveBeenCalledWith({
        userId: "userId",
        mediaURL: "uploads/test.jpg",
        description: "Test Media Description",
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        mediaId: "mediaId",
        mediaURL: "uploads/test.jpg",
        description: "Test Media Description",
      });
    });
  });

  describe("deleteMedia", () => {
    it("should delete media successfully", async () => {
      const req = {
        params: { mediaId: "mediaId" },
        user: { _id: "userId" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      Media.findById.mockResolvedValue({
        _id: "mediaId",
        userId: "userId",
        remove: jest.fn().mockResolvedValue(true),
      });

      await deleteMedia(req, res);

      expect(Media.findById).toHaveBeenCalledWith("mediaId");
      expect(res.json).toHaveBeenCalledWith({
        message: "Media deleted successfully",
      });
    });

    it("should return 404 if media not found", async () => {
      const req = {
        params: { mediaId: "mediaId" },
        user: { _id: "userId" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      Media.findById.mockResolvedValue(null);

      await deleteMedia(req, res);

      expect(Media.findById).toHaveBeenCalledWith("mediaId");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Media not found" });
    });
  });

  describe("likeMedia", () => {
    it("should like media successfully", async () => {
      const req = {
        params: { mediaId: "mediaId" },
        user: { _id: "userId" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      Media.findById.mockResolvedValue({
        _id: "mediaId",
        likes: [],
        save: jest.fn().mockResolvedValue(true),
      });

      await likeMedia(req, res);

      expect(Media.findById).toHaveBeenCalledWith("mediaId");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        mediaId: "mediaId",
        likesCount: 1,
      });
    });

    it("should return 404 if media not found", async () => {
      const req = {
        params: { mediaId: "mediaId" },
        user: { _id: "userId" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      Media.findById.mockResolvedValue(null);

      await likeMedia(req, res);

      expect(Media.findById).toHaveBeenCalledWith("mediaId");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Media not found" });
    });

    it("should return 400 if media already liked", async () => {
      const req = {
        params: { mediaId: "mediaId" },
        user: { _id: "userId" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      Media.findById.mockResolvedValue({
        _id: "mediaId",
        likes: ["userId"],
        save: jest.fn().mockResolvedValue(true),
      });

      await likeMedia(req, res);

      expect(Media.findById).toHaveBeenCalledWith("mediaId");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Media already liked" });
    });
  });

  describe("commentOnMedia", () => {
    it("should add a comment to media successfully", async () => {
      const req = {
        params: { mediaId: "mediaId" },
        body: { comment: "Test Comment" },
        user: { _id: "userId" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      Media.findById.mockResolvedValue({
        _id: "mediaId",
        comments: [],
        save: jest.fn().mockResolvedValue(true),
      });

      Comment.create.mockResolvedValue({
        _id: "commentId",
        userId: "userId",
        mediaId: "mediaId",
        comment: "Test Comment",
      });

      await commentOnMedia(req, res);

      expect(Media.findById).toHaveBeenCalledWith("mediaId");
      expect(Comment.create).toHaveBeenCalledWith({
        userId: "userId",
        mediaId: "mediaId",
        comment: "Test Comment",
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        commentId: "commentId",
        comment: "Test Comment",
      });
    });

    it("should return 404 if media not found", async () => {
      const req = {
        params: { mediaId: "mediaId" },
        body: { comment: "Test Comment" },
        user: { _id: "userId" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      Media.findById.mockResolvedValue(null);

      await commentOnMedia(req, res);

      expect(Media.findById).toHaveBeenCalledWith("mediaId");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Media not found" });
    });
  });
});
