import express from "express";
import {
    addTestimonial,
    getTestimonials,
    deleteTestimonial,
    toggleTestimonialStatus,
} from "./testimonial.controller.js";
import { uploadTestimonialImage } from "../upload/multer.js";

const router = express.Router();

router.get("/", getTestimonials);
router.post("/", uploadTestimonialImage.single("image"), addTestimonial);
router.delete("/:id", deleteTestimonial);
router.patch("/:id/toggle", toggleTestimonialStatus);

export default router;
