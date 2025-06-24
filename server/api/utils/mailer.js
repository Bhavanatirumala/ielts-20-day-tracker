const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, // Your Gmail address
    pass: process.env.GMAIL_PASS, // App password (not your Gmail password)
  },
});

async function sendOTPEmail(to, otp) {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`,
  };
  await transporter.sendMail(mailOptions);
}

module.exports = { sendOTPEmail }; 