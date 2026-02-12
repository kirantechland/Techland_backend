import Project from "./project.model.js";
import { deleteFile } from "../utils/fileUtils.js";

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
            image: (req.file.path && req.file.path.startsWith("http"))
                ? req.file.path
                : `/uploads/projects/${req.file.filename}`,
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
        const project = await Project.findById(id);

        if (project && project.image) {
            deleteFile(project.image);
        }

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

/* UPDATE FULL */
export const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, category, client, status } = req.body;
        const project = await Project.findById(id);
        if (!project) return res.status(404).json({ message: "Project not found" });

        const updateData = { title, category, client, status };

        if (req.file) {
            if (project.image) deleteFile(project.image);
            updateData.image = (req.file.path && req.file.path.startsWith("http"))
                ? req.file.path
                : `/uploads/projects/${req.file.filename}`;
        }

        const updatedProject = await Project.findByIdAndUpdate(id, updateData, { new: true });
        res.json(updatedProject);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

