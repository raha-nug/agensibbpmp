const ftp = require("basic-ftp");

async function uploadToFTP(fileBuffer, remotePath) {
  const client = new ftp.Client();
  client.ftp.verbose = true; // Logging agar bisa debug

  try {
    await client.access({
      host: "ftp.agensibbpmp.com",
      user: "u143117858.agensibbpmp",
      password: "FTPAccount123*",
      secure: false, // Hostinger biasanya pakai FTP tanpa SSL
    });

    console.log("📡 Terhubung ke FTP. Mengupload file...");

    // Upload langsung dari buffer ke FTP
    await client.uploadFrom(Buffer.from(fileBuffer), remotePath);
    console.log("✅ Upload berhasil:", remotePath);
  } catch (error) {
    console.error("❌ Gagal upload ke FTP:", error);
    throw error;
  } finally {
    client.close();
  }
}

module.exports = uploadToFTP;
