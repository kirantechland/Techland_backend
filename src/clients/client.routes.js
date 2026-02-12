import express from "express";
import {
    addClient,
    getClients,
    deleteClient,
    toggleClientStatus,
    updateClient,
} from "./client.controller.js";
import { uploadClientLogo } from "../upload/multer.js";

const router = express.Router();

router.get("/", getClients);
router.post("/", uploadClientLogo.single("image"), addClient);
router.put("/:id", uploadClientLogo.single("image"), updateClient);
router.delete("/:id", deleteClient);
router.patch("/:id/toggle", toggleClientStatus);

export default router;
