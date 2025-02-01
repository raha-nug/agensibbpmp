const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET_KEY;

// Middleware to verify JWT token from cookie
const verifyToken = (req, res, next) => {
  // Get token from cookies
  const token = req.cookies.token;

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  // Verify token
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).json({ message: "Failed to authenticate token" });
    }

    // Store user info in request object
    req.userId = decoded.id;
    req.userRole = decoded.role;
    req.userNama = decoded.nama;
    next();
  });
};

// Middleware to check if the user is Admin
const isAdmin = (req, res, next) => {
  if (req.userRole !== "admin") {
    return res.status(403).json({ message: "Require Admin Role" });
  }
  next();
};

module.exports = { verifyToken, isAdmin };
