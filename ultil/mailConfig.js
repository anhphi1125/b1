const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: 'anhphi1125@gmail.com',
      pass: 'zodqbudpqyxradcq'
    }
  });

module.exports = { transporter };