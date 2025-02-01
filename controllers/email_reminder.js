const cron = require("node-cron");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const sendEmail = require("./send_mail");

// Jalankan cron setiap jam 9 pagi untuk mencari surat yang mendekati deadline
cron.schedule("0 9 * * *", async () => {
  const now = new Date();
  const next24Hours = new Date(now);
  next24Hours.setHours(next24Hours.getHours() + 24); // Mengatur 24 jam ke depan

  try {
    // Cari surat yang akan kedaluwarsa dalam 24 jam dan belum dibaca
    const usersToRemind = await prisma.suratOnUsers.findMany({
      where: {
        isReaded: false,
        surat: {
          deadline: {
            gte: now,
            lte: next24Hours,
          },
        },
      },
      include: {
        user: true, // Untuk mengakses email pengguna
        surat: true, // Untuk mengakses field `deadline` dari model `Surat`
      },
    });

    // Kirim pengingat email untuk setiap pengguna yang memenuhi kriteria
    usersToRemind.forEach((record) => {
      sendEmail({
        to: record.user.email,
        subject: "Reminder: Batas Waktu Membaca Surat",
        text: `Anda memiliki surat yang perlu dibaca sebelum ${record.surat.deadline.toLocaleString()}.`,
      });
    });
  } catch (error) {
    console.error("Error in cron job:", error);
  }
});
