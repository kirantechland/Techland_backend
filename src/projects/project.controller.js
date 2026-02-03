import Project from "./project.model.js";

/* CREATE */
export const addProject = async (req, res) => {
    try {
        const { title, category, client, status } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "Image required" });
        }

        const project = await Project.create({
            title,
            category,
            client,
            status,
            image: `/uploads/projects/${req.file.filename}`,
        });

        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* READ */
export const getProjects = async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* DELETE */
export const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        await Project.findByIdAndDelete(id);
        res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* TOGGLE STATUS */
export const toggleProjectStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findById(id);
        project.isActive = !project.isActive;
        await project.save();
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
     
/* UPDATE STATUS TEXT */
export const updateProjectStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const project = await Project.findByIdAndUpdate(id, { status }, { new: true });
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
