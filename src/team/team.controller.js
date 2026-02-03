import Team from "./team.model.js";

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
      image: `/uploads/team/${req.file.filename}`,
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
  await Team.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};

/* TOGGLE ACTIVE */
export const toggleTeamStatus = async (req, res) => {
  const member = await Team.findById(req.params.id);
  member.isActive = !member.isActive;
  await member.save();
  res.json(member);
};
