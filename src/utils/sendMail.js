// const nodemailer = require("nodemailer");
const email_name = process.env.EMAIL_NAME || 'levantung.python@gmail.com';
const email_password = process.env.EMAIL_APP_PASSWORD || 'nfprnzodtbovpyer';

// module.exports = sendMail; 
const nodemailer = require('nodemailer');

const sendMail = async (email, html) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: email_name,
      pass: email_password,
    },
  });

  const mailOptions = {
    from: 'Book Store <no-reply@bookstore.email>',
    to: email,
    subject: 'Order successfully',
    html: html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = sendMail;

// https://www.netflix.com/helloworld
