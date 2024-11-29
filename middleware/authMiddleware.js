const jwt = require("jsonwebtoken");

exports.protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res.status(401).json({ error: "Not authorized, no token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token verification failed" });
  }
};

exports.adminOnly = (req, res, next) => {
  if (req.user.role !== "Admin")
    return res.status(403).json({ error: "Access denied" });
  next();
};
