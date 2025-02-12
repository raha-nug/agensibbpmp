const ftp = require("basic-ftp");
const stream = require("stream");

async function uploadToFTP(buffer, remotePath) {
  const client = new ftp.Client();
  client.ftp.verbose = true; // Logging agar bisa debug

  try {
    await client.access({
      host: process.env.FTP_HOST, // Gunakan hostname yang sesuai
      user: process.env.FTP_USER, // Gunakan username yang sesuai
      password: process.env.FTP_PASS, // Gunakan password yang sesuai
      secure: false, // Pastikan sesuai dengan konfigurasi Hostinger
    });

    console.log("✅ Connected to FTP!");

    // Pastikan folder target ada, jika belum buat dulu
    await client.ensureDir(".");

    // Konversi buffer ke stream agar bisa diunggah ke FTP
    const readableStream = new stream.PassThrough();
    readableStream.end(buffer);

    // Upload file dari buffer ke remote FTP
    await client.uploadFrom(
      readableStream,
      `/${remotePath}`
    );

    console.log("✅ File uploaded successfully!");
  } catch (err) {
    console.error("❌ FTP Upload Error:", err);
  } finally {
    client.close();
  }
}

module.exports = uploadToFTP;
