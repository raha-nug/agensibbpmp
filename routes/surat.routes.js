const express = require("express");
const router = express.Router();
const suratController = require("../controllers/surat.controller");
const { isAdmin } = require("../middlewares/auth.middleware");

const multer = require("multer");
const path = require("path");

// Konfigurasi storage untuk menyimpan file di folder 'uploads'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Menyimpan file di folder 'uploads'
  },
  filename: function (req, file, cb) {
    // Menamai file dengan timestamp dan ekstensi file aslinya
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Membuat instance multer dengan storage
const upload = multer({ storage: storage });

// Surat routes
router.get("/", suratController.getAllSurat);
router.get("/:id", suratController.getSuratById);
router.post("/", isAdmin, upload.single("file"), suratController.createSurat);
router.put("/:id", suratController.updateSurat);
router.delete("/:id", suratController.deleteSurat);

module.exports = router;
