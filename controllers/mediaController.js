const Media = require("../models/mediaModel");
const Comment = require("../models/commentModel");
const path = require("path");

/**
 * @desc Upload media
 * @route POST /media
 * @access Private
 */
const uploadMedia = async (req, res) => {
  const { description } = req.body;
  const mediaFile = req.file;
  const mediaURL = path.join("uploads", mediaFile.filename);

  const media = await Media.create({
    userId: req.user._id,
    mediaURL,
    description,
  });

  res.status(201).json({ mediaId: media._id, mediaURL, description });
};

/**
 * @desc Delete media
 * @route DELETE /media/:mediaId
 * @access Private
 */
const deleteMedia = async (req, res) => {
  const media = await Media.findById(req.params.mediaId);

  if (media) {
    if (media.userId.toString() !== req.user._id.toString()) {
      res.status(401).json({ message: "User not authorized" });
      return;
    }

    await media.remove();
    res.json({ message: "Media deleted successfully" });
  } else {
    res.status(404).json({ message: "Media not found" });
  }
};

/**
 * @desc Like media
 * @route POST /media/:mediaId/like
 * @access Private
 */
const likeMedia = async (req, res) => {
  const media = await Media.findById(req.params.mediaId);

  if (!media) {
    res.status(404).json({ message: "Media not found" });
    return;
  }

  if (media.likes.includes(req.user._id)) {
    res.status(400).json({ message: "Media already liked" });
    return;
  }

  media.likes.push(req.user._id);
  await media.save();

  res.status(200).json({ mediaId: media._id, likesCount: media.likes.length });
};

/**
 * @desc Comment on media
 * @route POST /media/:mediaId/comment
 * @access Private
 */
const commentOnMedia = async (req, res) => {
  const { comment } = req.body;

  const media = await Media.findById(req.params.mediaId);

  if (!media) {
    res.status(404).json({ message: "Media not found" });
    return;
  }

  const newComment = await Comment.create({
    userId: req.user._id,
    mediaId: req.params.mediaId,
    comment,
  });

  media.comments.push(newComment._id);
  await media.save();

  res
    .status(201)
    .json({ commentId: newComment._id, comment: newComment.comment });
};

module.exports = {
  uploadMedia,
  deleteMedia,
  likeMedia,
  commentOnMedia,
};
