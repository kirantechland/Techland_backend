import express from "express";
import teamRoutes from "./team/team.routes.js";
import activityRoutes from "./activities/activity.routes.js";
import projectRoutes from "./projects/project.routes.js";
import clientRoutes from "./clients/client.routes.js";
import contactRoutes from "./contacts/contact.routes.js";
import testimonialRoutes from "./testimonials/testimonial.routes.js";

const router = express.Router();

// Mount routes
router.use("/team", teamRoutes);
router.use("/activities", activityRoutes);
router.use("/projects", projectRoutes);
router.use("/clients", clientRoutes);
router.use("/contact", contactRoutes);
router.use("/testimonials", testimonialRoutes);

export default router;
