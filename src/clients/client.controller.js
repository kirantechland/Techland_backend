import Client from "./client.model.js";
import { deleteFile } from "../utils/fileUtils.js";

/* CREATE */
export const addClient = async (req, res) => {
    try {
        const { name, industry } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "Logo required" });
        }

        const client = await Client.create({
            name,
            industry,
            logo: (req.file.path && req.file.path.startsWith("http"))
                ? req.file.path
                : `/uploads/clients/${req.file.filename}`,
        });

        res.json(client);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* READ */
export const getClients = async (req, res) => {
    try {
        const clients = await Client.find().sort({ createdAt: -1 });
        res.json(clients);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* DELETE */
export const deleteClient = async (req, res) => {
    try {
        const { id } = req.params;
        const client = await Client.findById(id);
        if (client && client.logo) {
            deleteFile(client.logo);
        }
        await Client.findByIdAndDelete(id);
        res.json({ success: true, message: "Client deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* UPDATE */
export const updateClient = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, industry } = req.body;
        const client = await Client.findById(id);
        if (!client) return res.status(404).json({ message: "Client not found" });

        const updateData = { name, industry };

        if (req.file) {
            if (client.logo) deleteFile(client.logo);
            updateData.logo = (req.file.path && req.file.path.startsWith("http"))
                ? req.file.path
                : `/uploads/clients/${req.file.filename}`;
        }

        const updatedClient = await Client.findByIdAndUpdate(id, updateData, { new: true });
        res.json(updatedClient);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* TOGGLE ACTIVE */
export const toggleClientStatus = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) return res.status(404).json({ message: "Client not found" });

        client.isActive = !client.isActive;
        await client.save();
        res.json(client);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

