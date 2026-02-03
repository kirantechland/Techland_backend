import express from "express";
import {
    submitContactForm,
    getContacts,
    deleteContact,
} from "./contact.controller.js";
import { adminAuth } from "../auth/auth.middleware.js";

const router = express.Router();

// Public route to submit contact form
router.post("/", submitContactForm);

// Routes (Temporarily unprotected for testing)
router.get("/", getContacts);
router.delete("/:id", deleteContact);

export default router;
