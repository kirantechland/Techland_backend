import Activity from "./activity.model.js";
import { deleteFile } from "../utils/fileUtils.js";

/* CREATE */
export const addActivity = async (req, res) => {
    try {
        const { title, description, date } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "Image required" });
        }

        const activity = await Activity.create({
            title,
            description,
            date,
            image: (req.file.path && req.file.path.startsWith("http"))
                ? req.file.path
                : `/uploads/activities/${req.file.filename}`,
        });

        res.json(activity);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* READ */
export const getActivities = async (req, res) => {
    try {
        const activities = await Activity.find().sort({ createdAt: -1 });
        res.json(activities);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* DELETE */
export const deleteActivity = async (req, res) => {
    try {
        const { id } = req.params;
        const activity = await Activity.findById(id);
        if (activity && activity.image) {
            deleteFile(activity.image);
        }
        await Activity.findByIdAndDelete(id);
        res.json({ success: true, message: "Activity deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* UPDATE */
export const updateActivity = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, date } = req.body;
        const activity = await Activity.findById(id);
        if (!activity) return res.status(404).json({ message: "Activity not found" });

        const updateData = { title, description, date };

        if (req.file) {
            if (activity.image) deleteFile(activity.image);
            updateData.image = (req.file.path && req.file.path.startsWith("http"))
                ? req.file.path
                : `/uploads/activities/${req.file.filename}`;
        }

        const updatedActivity = await Activity.findByIdAndUpdate(id, updateData, { new: true });
        res.json(updatedActivity);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* TOGGLE ACTIVE */
export const toggleActivityStatus = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);
        if (!activity) return res.status(404).json({ message: "Activity not found" });

        activity.isActive = !activity.isActive;
        await activity.save();
        res.json(activity);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

