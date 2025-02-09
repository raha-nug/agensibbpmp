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

    console.log("Terhubung ke FTP...");

    // Upload file ke Hostinger
    await client.uploadFrom(localFilePath, remoteFilePath);
    console.log("Upload berhasil:", remoteFilePath);
  } catch (err) {
    console.error("Upload gagal:", err);
  }

  client.close();
}

module.exports = uploadToFTP;
