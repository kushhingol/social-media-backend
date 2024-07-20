const User = require("../models/userModel");

/**
 * @desc Register a new user
 * @route POST /users/register
 * @access Public
 */
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400).json({ message: "User already exists" });
    return;
  }

  const user = await User.create({ username, email, password });

  if (user) {
    res
      .status(201)
      .json({ _id: user._id, username: user.username, email: user.email });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
};

/**
 * @desc Update user profile
 * @route PUT /users/:userId
 * @access Private
 */
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.params.userId);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

/**
 * @desc Delete user account
 * @route DELETE /users/:userId
 * @access Private
 */
const deleteUserAccount = async (req, res) => {
  const user = await User.findById(req.params.userId);

  if (user) {
    await user.remove();
    res.json({ message: "User account deleted successfully" });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

/**
 * @desc Get user by ID
 * @route GET /users/:userId
 * @access Private
 */
const getUserById = async (req, res) => {
  const user = await User.findById(req.params.userId).select("-password");

  if (user) {
    res.json({ _id: user._id, username: user.username, email: user.email });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

module.exports = {
  registerUser,
  updateUserProfile,
  deleteUserAccount,
  getUserById,
};
