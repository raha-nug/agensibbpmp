const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get All Users
const getUsers = async (req, res) => {
  try {
    const users = await prisma.users.findMany({
      include: {
        role: true, // Including related role information
      },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// Get User by ID
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.users.findUnique({
      where: { id: parseInt(id) },
      include: { role: true },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

// Create New User
const createUser = async (req, res) => {
  const { nama, email, password, roleType } = req.body;
  try {
    const user = await prisma.users.create({
      data: {
        nama,
        email,
        password,
        roleType, // Ensure the roleType exists in Role model
      },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
};

// Update User
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { nama, email, password, roleType } = req.body;
  try {
    const updatedUser = await prisma.users.update({
      where: { id: parseInt(id) },
      data: { nama, email, password, roleType },
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.users.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
