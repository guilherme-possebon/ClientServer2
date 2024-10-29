import * as nodemailer from "nodemailer";
import * as fs from "fs";

console.log("Email");

let emailConfig = {
  host: "smtp.mailersend.net",
  port: 587,
  auth: {
    user: "MS_q2H7LQ@trial-v69oxl5n95dl785k.mlsender.net",
    pass: "GDHsGziMsC9hEjkx",
  },
};

let html = fs.readFileSync("email.html");

let mailOptions = {
  from: "teste@trial-v69oxl5n95dl785k.mlsender.net",
  to: "gpossebon67@gmail.com",
  subject: "Estou enviando um email pelo TS",
  html: html,
};

let transporter = nodemailer.createTransport(emailConfig);

transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.log("Erro ao enviar email: " + error);
  } else {
    console.log("Email enviado: " + info.response);
  }
});
