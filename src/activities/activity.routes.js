import express from "express";
import {
    addActivity,
    getActivities,
    deleteActivity,
    toggleActivityStatus,
} from "./activity.controller.js";
import { uploadActivityImage } from "../upload/multer.js";

const router = express.Router();

router.get("/", getActivities);
router.post("/", uploadActivityImage.single("image"), addActivity);
router.delete("/:id", deleteActivity);
router.patch("/:id/toggle", toggleActivityStatus);

export default router;
