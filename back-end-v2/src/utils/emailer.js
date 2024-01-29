const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PW
  }
});

exports.sendEmail = async (receivers, subject, message) => {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Grey Black" <greyblack1683@gmail.com>', // sender address
    to: receivers, // list of receivers
    subject, // Subject line
    // text: "Hello world?", // plain text body
    html: message // html body
  });

  console.log("Message sent: %s", info.messageId);
};
