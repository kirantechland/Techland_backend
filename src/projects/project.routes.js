import express from "express";
import {
    addProject,
    getProjects,
    deleteProject,
    toggleProjectStatus,
    updateProjectStatus,
    updateProject,
} from "./project.controller.js";
import { uploadProjectImage } from "../upload/multer.js";
import { validate, projectSchemas } from "../middleware/validation.js";

const router = express.Router();

router.get("/", getProjects);
router.post("/", uploadProjectImage.single("image"), validate(projectSchemas.create), addProject);
router.put("/:id", uploadProjectImage.single("image"), updateProject);
router.delete("/:id", deleteProject);
router.patch("/:id/toggle", toggleProjectStatus);
router.patch("/:id/status", validate(projectSchemas.updateStatus), updateProjectStatus);

export default router;
