const express = require("express");
const router = express.Router();
const {
  registerUser,
  updateUserProfile,
  deleteUserAccount,
  getUserById,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", registerUser);
router.put("/:userId", authMiddleware, updateUserProfile);
router.delete("/:userId", authMiddleware, deleteUserAccount);
router.get("/:userId", authMiddleware, getUserById);

module.exports = router;
