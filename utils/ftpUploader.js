const ftp = require("basic-ftp");
const fs = require("fs");

async function uploadToFTP(localFilePath, remoteFilePath) {
  const client = new ftp.Client();
  client.ftp.verbose = true; // Aktifkan log

  try {
    await client.access({
      host: "ftp.agensibbpmp.com",
      user: "u143117858.agensibbpmp",
      password: "FTPAccount123*",
      secure: false,
    });

    console.log("📡 Terhubung ke FTP. Mengupload file...");
    await client.uploadFrom(localPath, remotePath);
    console.log("✅ Upload berhasil:", remotePath);
  } catch (error) {
    console.error("❌ Gagal upload ke FTP:", error);
    throw error;
  } finally {
    client.close();
  }

}

module.exports = uploadToFTP;
