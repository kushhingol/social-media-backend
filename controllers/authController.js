const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

/**
 * @desc Auth user & get token
 * @route POST /auth/login
 * @access Public
 */
const authUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};

module.exports = {
  authUser,
};
