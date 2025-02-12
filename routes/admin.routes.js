const express = require("express");
const router = express.Router();
const suratController = require("../controllers/surat.controller");
const { PrismaClient } = require("@prisma/client");
const { isAdmin } = require("../middlewares/auth.middleware");
const prisma = new PrismaClient();

const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// User routes
router.get("/", (req, res) => {
  res.render("admin_dashboard", { nama: req.userNama });
});

router.post(
  "/add-surat",
  isAdmin,
  upload.single("file"),
  suratController.createSurat
);

router.get("/add-surat", async (req, res) => {
  const users = await prisma.users.findMany({
    where: {
      roleType: "user",
    },
  });

  res.render("add_surat", { users });
});

router.get("/track", suratController.getAllSurat);

module.exports = router;
