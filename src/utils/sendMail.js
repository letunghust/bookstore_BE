const nodemailer = require("nodemailer");
const email_name = process.env.EMAIL_NAME || 'levantung.python@gmail.com';
const email_password = process.env.EMAIL_APP_PASSWORD || 'nfprnzodtbovpyer';


const sendMail = async (email, html) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
          user: email_name,
          pass: email_password,
        },
      });
      
      // async..await is not allowed in global scope, must use a wrapper

        // send mail with defined transport object
        const info = await transporter.sendMail({
          from: 'Book Store <no-reply@bookstore.email>', // sender address
          to: email, // list of receivers
          subject: "Reset password", // Subject line
          html: html, // html body
        });
      
        console.log("Message sent: %s", info.messageId);
        // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>

        return info;  
}

module.exports = sendMail; 