const express = require("express");
const router = express.Router();
const {
  uploadMedia,
  deleteMedia,
  likeMedia,
  commentOnMedia,
} = require("../controllers/mediaController");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../utils/fileHandler");

router.post("/", authMiddleware, upload.single("mediaFile"), uploadMedia);
router.delete("/:mediaId", authMiddleware, deleteMedia);
router.post("/:mediaId/like", authMiddleware, likeMedia);
router.post("/:mediaId/comment", authMiddleware, commentOnMedia);

module.exports = router;
