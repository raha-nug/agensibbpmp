const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET_KEY;

// Register for Admin or User
const register = async (req, res) => {
  const { nama, email, password, roleType } = req.body;

  try {
    // Validate that the role exists
    const role = await prisma.role.findUnique({ where: { type: roleType } });
    if (!role) {
      return res.status(400).json({ error: "Invalid role type" });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check role and create Admin or User
    if (roleType === "admin") {
      const admin = await prisma.users.create({
        data: { nama, roleType: "admin", email, password: hashedPassword },
      });
      return res
        .status(201)
        .json({ message: "Admin registered successfully", admin });
    } else {
      const user = await prisma.users.create({
        data: {
          roleType: "user",
          email,
          password: hashedPassword,
          nama,
        },
      });
      return res
        .status(201)
        .json({ message: "User registered successfully", user });
    }
  } catch (error) {
    res.status(500).json({ error: "Error registering user" });
  }
};

// Login for Admin or User
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find admin or user by email
    const user = await prisma.users.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare passwords
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Create a JWT token
    const token = jwt.sign({ id: user.id, role: user.roleType, nama: user.nama }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, { httpOnly: true });

    if (user.roleType === "admin") {
      return res.redirect("/admin");
    }
    return res.redirect("/agensi");
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
};

const logout = (req, res) => {
  res.clearCookie("token", { httpOnly: true });
  return res.redirect("/auth/login"); // Redirect to the login page after logout
};





module.exports = { register, login, logout };
