const nodemailer = require("nodemailer");

const sendMail = async (email, title, body) => {
  try {
    // Create a Transporter to send emails
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      secure: false,
      auth: {
        user: "vihangaeshan2002@gmail.com",
        pass: "thutwzplzbwwvejg",
      },
    });
    // Send emails to users
    let info = await transporter.sendMail({
      from: "www.sandeepdev.me - Sandeep Singh",
      to: email,
      subject: title,
      html: body,
    });
    console.log("Email info: ", info);
    return info;
  } catch (error) {
    console.log(error.message);
  }
};
module.exports = sendMail;
