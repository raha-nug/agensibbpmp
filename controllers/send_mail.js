const nodemailer = require("nodemailer");

async function sendEmail({ to, subject, text }) {
  let transporter = nodemailer.createTransport({
    service: "gmail", // atau penyedia email lain
    auth: {
      user: process.env.EMAIL_SENDER,
      pass: process.env.PASSWORD_APP_SENDER,
    },
  });

  await transporter.sendMail({
    from: process.env.ADMIN_EMAIL,
    to,
    subject,
    text,
  });
}

module.exports = sendEmail;
