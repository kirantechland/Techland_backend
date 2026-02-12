import Team from "./team.model.js";
import { deleteFile } from "../utils/fileUtils.js";

/* CREATE */
export const addTeamMember = async (req, res) => {
  try {
    const { name, role } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image required" });
    }

    const member = await Team.create({
      name,
      role,
      image: (req.file.path && req.file.path.startsWith("http"))
        ? req.file.path
        : `/uploads/team/${req.file.filename}`,
    });

    res.json(member);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* READ */
export const getTeam = async (req, res) => {
  const team = await Team.find().sort({ createdAt: -1 });
  res.json(team);
};

/* DELETE */
export const deleteTeamMember = async (req, res) => {
  const { id } = req.params;
  const member = await Team.findById(id);
  if (member && member.image) {
    deleteFile(member.image);
  }
  await Team.findByIdAndDelete(id);
  res.json({ success: true });
};

/* UPDATE */
export const updateTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role } = req.body;
    const member = await Team.findById(id);
    if (!member) return res.status(404).json({ message: "Member not found" });

    const updateData = { name, role };

    if (req.file) {
      if (member.image) deleteFile(member.image);
      updateData.image = (req.file.path && req.file.path.startsWith("http"))
        ? req.file.path
        : `/uploads/team/${req.file.filename}`;
    }

    const updatedMember = await Team.findByIdAndUpdate(id, updateData, { new: true });
    res.json(updatedMember);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* TOGGLE ACTIVE */
export const toggleTeamStatus = async (req, res) => {
  const member = await Team.findById(req.params.id);
  member.isActive = !member.isActive;
  await member.save();
  res.json(member);
};

