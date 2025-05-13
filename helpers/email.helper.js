const nodemailer = require("nodemailer");
require('dotenv').config(); // Load environment variables

async function sendMail(email, message) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10), // Ensure the port is a number
      secure: process.env.SMTP_PORT == 465, // Use secure connection only for port 465
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: `${message.messageSubject} - KTR`,
      html: message.messageBody,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log(`Email successfully sent to ${email}`);
  } catch (error) {
    console.error(`Error sending email to ${email}:`, error);
  }
}


const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function sendMails(users, message, delayTime = 1000) {
  for (const user of users) {
    try {
      await sendMail(user.email, message); 
      console.log(`Email sent to ${user.email}`);
      await delay(delayTime);
    } catch (error) {
      console.error(`Failed to send email to ${user.email}: ${error.message}`);
    }
  }
}

module.exports = {
  sendMail,
  sendMails,
};
