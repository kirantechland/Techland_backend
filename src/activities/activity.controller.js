import Activity from "./activity.model.js";

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
            image: `/uploads/activities/${req.file.filename}`,
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
        await Activity.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Activity deleted" });
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
