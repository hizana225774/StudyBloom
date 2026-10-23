
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Please log in to access this resource."
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Authentication token is missing."
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("_id username");

    if (!user) {
      return res.status(401).json({
        message: "User account not found. Please log in again."
      });
    }

    req.user = {
      id: user._id.toString(),
      username: user.username
    };

    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        message: "Your session is invalid or expired. Please log in again."
      });
    }

    console.error("Authentication error:", error.message);

    return res.status(500).json({
      message: "Authentication could not be verified."
    });
  }
};

module.exports = authMiddleware;
