const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
// console.log(process.env.EMAIL_USER + " " + process.env.EMAIL_PASS);

async function sendPasswordResetEmail(to, token) {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: '"NoteNest" <no-reply@notenest.com>', // fixed missing closing `>`
    to,
    subject: "Reset Your NoteNest Password",
    html: `
      <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
        <p>Hello,</p>
        <p>You requested to reset your NoteNest password.</p>
        <p>Click the button below to reset your password:</p>
        <p>
          <a href="${resetUrl}" style="
            background-color: #4F46E5;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 6px;
            display: inline-block;
            font-weight: bold;
          ">
            Reset Password
          </a>
        </p>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>This link will expire in 15 minutes.</p>
        <p>If you didn't request a password reset, please ignore this email.</p>
        <br />
        <p>– The NoteNest Team</p>
      </div>
    `,
    text: `
      You requested to reset your NoteNest password.
      Reset it using the link below (valid for 15 minutes):
      ${resetUrl}

      If you did not request this, please ignore this email.
    `,
  });
}

module.exports = { sendPasswordResetEmail };
