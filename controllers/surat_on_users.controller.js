const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get All Surat for a Specific User
const getSuratForUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const suratOnUsers = await prisma.suratOnUsers.findMany({
      where: { userId: parseInt(userId) },
      include: {
        surat: true, // Include related Surat data
      },
    });
    res.status(200).json(suratOnUsers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch surat for user" });
  }
};

// Mark Surat as Read
const markSuratAsRead = async (req, res) => {
  const { userId, suratId } = req.params;
  try {
    const updatedSurat = await prisma.suratOnUsers.update({
      where: {
        userId_suratId: {
          userId: parseInt(userId),
          suratId: parseInt(suratId),
        },
      },
      data: { isReaded: true },
    });
    res.status(200).json(updatedSurat);
  } catch (error) {
    res.status(500).json({ error: "Failed to mark surat as read" });
  }
};

// Mark Surat as Downloaded
const markSuratAsDownloaded = async (req, res) => {
  const { userId, suratId } = req.params;
  try {
    const updatedSurat = await prisma.suratOnUsers.update({
      where: {
        userId_suratId: {
          userId: parseInt(userId),
          suratId: parseInt(suratId),
        },
      },
      data: { isDownloaded: true },
    });
    res.status(200).json(updatedSurat);
  } catch (error) {
    res.status(500).json({ error: "Failed to mark surat as downloaded" });
  }
};

module.exports = {
  getSuratForUser,
  markSuratAsRead,
  markSuratAsDownloaded,
};
