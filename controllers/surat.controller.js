const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const path = require("path");
const fs = require("fs");
const sendEmail = require("./send_mail");
const ftpUploader = require("../utils/ftpUploader")

// Get All Surat
const getAllSurat = async (req, res) => {
  try {
    const surat = await prisma.surat.findMany({
      include: {
        tujuan: {
          include: {
            user: true, // Include the User related to tujuan (SuratOnUsers)
          },
        },
      },
      orderBy: {
        deadline: "desc", // Urutkan berdasarkan deadline terbaru
        // Jika menggunakan createdAt: createdAt: 'desc',
      },
    });
    res.render("track_surat", { surat });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch surat" });
  }
};

// Get Surat by ID
const getSuratById = async (req, res) => {
  const { id } = req.params;
  try {
    const surat = await prisma.surat.findUnique({
      where: { id: parseInt(id) },
      include: { tujuan: true },
    });

    if (!surat) return res.status(404).json({ error: "Surat not found" });

    return res.render("detail_surat", { surat, userId: req.userId });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch surat" });
  }
};

// Create New Surat
const createSurat = async (req, res) => {
  const { judul, deskripsi, deadline, tujuan } = req.body;

  try {
    let lampiran = null;

    if (req.file) {
      const filename = `${Date.now()}-${req.file.originalname}`; // Nama unik
      lampiran = await uploadToFTP(req.file.path, filename); // Upload ke Hostinger

      // Hapus file lokal setelah diupload
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Gagal menghapus file sementara:", err);
      });
    }

    const surat = await prisma.surat.create({
      data: {
        judul,
        deskripsi,
        lampiran, // Simpan URL, bukan path lokal
        deadline: new Date(deadline),
        tujuan: {
          create: tujuan.map((userId) => ({
            user: { connect: { id: parseInt(userId) } },
          })),
        },
      },
    });

    res.redirect("/admin/track");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal membuat surat" });
  }
};

// Update Surat
const updateSurat = async (req, res) => {
  const { id } = req.params;
  const { judul, deskripsi, lampiran, deadline } = req.body;
  try {
    const updatedSurat = await prisma.surat.update({
      where: { id: parseInt(id) },
      data: {
        judul,
        deskripsi,
        lampiran,
        deadline: new Date(deadline),
      },
    });
    res.status(200).json(updatedSurat);
  } catch (error) {
    res.status(500).json({ error: "Failed to update surat" });
  }
};

// Delete Surat
const deleteSurat = async (req, res) => {
  const { id } = req.params;
  try {
    const surat = await prisma.surat.findUnique({
      where: { id: parseInt(id) },
    });

    if (!surat) {
      return res.status(404).json({ message: "Surat tidak ditemukan" });
    }

    // Hapus entri SuratOnUsers yang terkait
    await prisma.suratOnUsers.deleteMany({
      where: { suratId: surat.id },
    });

    if (surat.lampiran) {
      console.log("__dirname:", __dirname);

      const filePath = path.join(
        __dirname,
        "../uploads",
        surat.lampiran.split("/").pop()
      );
      console.log("Path yang dihasilkan:", filePath);

      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
          // Kita tetap lanjutkan meskipun ada error saat menghapus file
        } else {
          console.log("File deleted successfully");
        }
      });
    }

    await prisma.surat.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "Surat berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete surat" });
  }
};

module.exports = {
  getAllSurat,
  getSuratById,
  createSurat,
  updateSurat,
  deleteSurat,
};
