import Testimonial from "./testimonial.model.js";
import { deleteFile } from "../utils/fileUtils.js";

/* CREATE */
export const addTestimonial = async (req, res) => {
    try {
        const { name, designation, message, rating } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "Image required" });
        }

        const testimonial = await Testimonial.create({
            name,
            designation,
            message,
            rating,
            image: (req.file.path && req.file.path.startsWith("http"))
                ? req.file.path
                : `/uploads/testimonials/${req.file.filename}`,
        });

        res.json(testimonial);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* READ */
export const getTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find().sort({ createdAt: -1 });
        res.json(testimonials);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* DELETE */
export const deleteTestimonial = async (req, res) => {
    try {
        const { id } = req.params;
        const testimonial = await Testimonial.findById(id);
        if (testimonial && testimonial.image) {
            deleteFile(testimonial.image);
        }
        await Testimonial.findByIdAndDelete(id);
        res.json({ success: true, message: "Testimonial deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* TOGGLE ACTIVE */
export const toggleTestimonialStatus = async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);
        if (!testimonial) return res.status(404).json({ message: "Testimonial not found" });

        testimonial.isActive = !testimonial.isActive;
        await testimonial.save();
        res.json(testimonial);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
