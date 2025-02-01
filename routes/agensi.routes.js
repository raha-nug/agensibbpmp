const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth.middleware");
const suratController = require("../controllers/surat.controller");


// User routes
router.get("/", (req, res) => {
  res.render("agensi_dashboard", { nama: req.userNama });
});


router.get("/surat", async (req, res) => {
  const id = req.userId; // Pastikan req.userId sudah di-set sebelumnya
  try {
    const surat = await prisma.surat.findMany({
      where: {
        tujuan: {
          some: {
            userId: id, // Filter surat yang memiliki tujuan dengan userId tertentu
          },
        },
      },
      include: {
        tujuan: {
          where: {
            userId: id, // Pastikan hanya mengambil relasi untuk user yang sesuai
          },
          select: {
            isReaded: true, // Hanya ambil informasi `isReaded`
            isDownloaded: true, // Bisa juga ambil `isDownloaded` jika diperlukan
          },
        },
      },
      orderBy: {
        deadline: "desc", // Urutkan berdasarkan deadline terbaru
      },
    });


    // if (!surat || surat.length === 0) {
    //   return res.status(404).json({ error: "Surat not found" });
    // }

    res.render("surat", { surat });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch surat" });
  }
});



router.get("/surat/:id", suratController.getSuratById);

module.exports = router;
