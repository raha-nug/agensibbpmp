const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get All Roles
const getRoles = async (req, res) => {
  try {
    const roles = await prisma.role.findMany({
      include: {
        user: true, // Including related users
      },
    });
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch roles" });
  }
};

// Get Role by ID
const getRoleById = async (req, res) => {
  const { id } = req.params;
  try {
    const role = await prisma.role.findUnique({
      where: { id: parseInt(id) },
      include: { user: true },
    });
    if (!role) return res.status(404).json({ error: "Role not found" });
    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch role" });
  }
};

// Create New Role
const createRole = async (req, res) => {
  const { type } = req.body;
  try {
    const role = await prisma.role.create({
      data: { type },
    });
    res.status(201).json(role);
  } catch (error) {
    res.status(500).json({ error: "Failed to create role" });
  }
};

// Update Role
const updateRole = async (req, res) => {
  const { id } = req.params;
  const { type } = req.body;
  try {
    const updatedRole = await prisma.role.update({
      where: { id: parseInt(id) },
      data: { type },
    });
    res.status(200).json(updatedRole);
  } catch (error) {
    res.status(500).json({ error: "Failed to update role" });
  }
};

// Delete Role
const deleteRole = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.role.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete role" });
  }
};

module.exports = {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
};
