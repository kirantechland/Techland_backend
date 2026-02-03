import express from "express";
import { login, logout, checkAuth } from "./auth.controller.js";
import { adminAuth } from "./auth.middleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/check", adminAuth, checkAuth);

export default router;
