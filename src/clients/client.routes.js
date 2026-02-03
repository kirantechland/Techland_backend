import express from "express";
import {
    addClient,
    getClients,
    deleteClient,
    toggleClientStatus,
} from "./client.controller.js";
import { uploadClientLogo } from "../upload/multer.js";

const router = express.Router();

router.get("/", getClients);
router.post("/", uploadClientLogo.single("logo"), addClient);
router.delete("/:id", deleteClient);
router.patch("/:id/toggle", toggleClientStatus);

export default router;
