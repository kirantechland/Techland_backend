import Client from "./client.model.js";

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
            logo: `/uploads/clients/${req.file.filename}`,
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
        await Client.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Client deleted" });
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
