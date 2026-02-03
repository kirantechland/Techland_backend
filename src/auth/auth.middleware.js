import jwt from "jsonwebtoken";

export const adminAuth = (req, res, next) => {
  const token = req.cookies.admin_token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
