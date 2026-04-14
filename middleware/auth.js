const jwt = require("jsonwebtoken");


module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // ❌ No token
    if (!authHeader) {
      return res.status(401).json({
        message: "No token, access denied",
      });
    }

    // "Bearer TOKEN"
    const token = authHeader.split(" ")[1];

    // 🔥 Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
    console.log(decoded)
    // Save user info
    req.user = decoded;

    next(); // ✅ allow request

  } catch (err) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};