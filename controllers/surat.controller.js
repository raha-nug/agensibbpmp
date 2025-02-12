const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const path = require("path");
const fs = require("fs");
const sendEmail = require("./send_mail");
const uploadToFTP = require("../utils/ftpUploader");

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
      const buffer = req.file.buffer;
      const fileName = `${Date.now()}-${req.file.originalname}`;
      const remotePath = fileName;

      await uploadToFTP(buffer, remotePath);
      lampiran = `https://uploads.agensibbpmp.com/${fileName}`;
    }

    // Pastikan `tujuan` sudah berbentuk array angka
    const tujuanParsed = Array.isArray(tujuan)
      ? tujuan.map((id) => parseInt(id))
      : [];

    // 🟢 Cek tujuan sebelum disimpan
    console.log("📌 Tujuan Surat:", tujuan);

    // Simpan surat dan hubungan ke users
    const surat = await prisma.surat.create({
      data: {
        judul,
        deskripsi,
        lampiran,
        deadline: new Date(deadline),
        tujuan: {
          create: tujuanParsed.map((userId) => ({
            user: {
              connect: { id: userId },
            },
          })),
        },
      },
      include: {
        tujuan: true, // Pastikan tujuan tersimpan
      },
    });

    console.log("✅ Surat berhasil dibuat:", surat);

    // Ambil email dari user yang dipilih
    const users = await prisma.users.findMany({
      where: { id: { in: tujuan.map((id) => parseInt(id)) } },
      select: { email: true },
    });

    console.log("📧 Email tujuan:", users);

    // Kirim email ke setiap user tujuan
    // Kirim email ke setiap user tujuan (gunakan Promise.all agar menunggu semua selesai)
    await Promise.all(
      users.map(async (user) => {
        try {
          console.log(`📨 Mengirim email ke: ${user.email}`);
          await sendEmail({
            to: user.email,
            subject: `📌 Pemberitahuan Surat Baru: ${judul}`,
            text: `Halo,

Anda mendapatkan surat baru dengan judul: "${judul}".
Deskripsi: ${deskripsi}
Deadline: ${deadline}

Silakan cek portal untuk informasi lebih lanjut.

Salam,
Portal Agensi BBPMP`,
          });
          console.log(`✅ Email sukses dikirim ke ${user.email}`);
        } catch (error) {
          console.error(`❌ Gagal mengirim email ke ${user.email}:`, error);
        }
      })
    );

    // 🔹 Redirect setelah semua email selesai dikirim
    res.redirect("/admin/track");

  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: "Failed to create surat" });
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
