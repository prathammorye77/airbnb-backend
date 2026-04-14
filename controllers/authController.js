const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");


exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔥 check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // 🔥 hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔥 create user
    const user = new User({
      email,
      password: hashedPassword,
    });

    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // 🔥 4. send response
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        _id: user._id,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔥 1. check user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    
    // 🔥 2. compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // 🔥 3. generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // 🔥 4. send response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
    });
  }
};
