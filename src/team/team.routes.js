import express from "express";
import {
  addTeamMember,
  getTeam,
  deleteTeamMember,
  toggleTeamStatus,
  updateTeamMember,
} from "./team.controller.js";

import { uploadTeamImage } from "../upload/multer.js";
import { adminAuth } from "../auth/auth.middleware.js";

const router = express.Router();

router.get("/", getTeam);
router.post("/", uploadTeamImage.single("image"), addTeamMember);
router.put("/:id", uploadTeamImage.single("image"), updateTeamMember);
router.delete("/:id", deleteTeamMember);
router.patch("/:id/toggle", toggleTeamStatus);

export default router;

