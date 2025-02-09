const express = require("express");
const router = express.Router();
const suratController = require("../controllers/surat.controller");
const { isAdmin } = require("../middlewares/auth.middleware");

const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Surat routes
router.get("/", suratController.getAllSurat);
router.get("/:id", suratController.getSuratById);
router.post("/", isAdmin, upload.single("file"), suratController.createSurat);
router.put("/:id", suratController.updateSurat);
router.delete("/:id", suratController.deleteSurat);

module.exports = router;
