import jwt from "jsonwebtoken";

export const login = (req, res) => {
  const { email, password } = req.body;

  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.cookie("admin_token", token, {
    httpOnly: true,
    secure: false, // true in production (https)
    sameSite: "strict",
  });

  res.json({ success: true });
};

export const logout = (req, res) => {
  res.clearCookie("admin_token");
  res.json({ success: true });
};

export const checkAuth = (req, res) => {
  res.json({ authenticated: true });
};
