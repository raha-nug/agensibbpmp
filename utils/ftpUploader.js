const ftp = require("basic-ftp");

async function uploadToFTP(fileBuffer, remotePath) {
  const client = new ftp.Client();
  client.ftp.verbose = true; // Logging agar bisa debug

  const BASE_URL = "https://uploads.agensibbpmp.com";

  try {
    await client.access({
      host: "ftp.agensibbpmp.com",
      user: "u143117858.agensibbpmp",
      password: "FTPAccount123*",
      secure: false, // Hostinger biasanya pakai FTP tanpa SSL
    });

    console.log("✅ Connected to FTP!");

    // Pastikan folder `uploads/` sudah ada, jika belum buat dulu
    await client.ensureDir("public_html/uploads");

    // Unggah file dari local ke remote FTP server
    await client.uploadFrom(localPath, `public_html/uploads/${remotePath}`);

    console.log("✅ File uploaded successfully!");

    return `${BASE_URL}/${remoteFileName}`;
  } catch (err) {
    console.error("❌ FTP Upload Error:", err);
  } finally {
    client.close();
  }
}

module.exports = uploadToFTP;
