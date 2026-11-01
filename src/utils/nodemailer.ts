import nodemailer from "nodemailer";

interface ISENDMAIL {
    to:string,
     subject:string,
    text?:string,
    html?:string
}
const sendMail =async({
    to,
    subject,
    text,
    html
}:ISENDMAIL)=>{
    const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,  
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});


  const info = await transporter.sendMail({
    from: '"Example Team" <team@example.com>', // sender address
    to: to, // list of recipients
    subject: subject, // subject line
    text: text, // plain text body
    html: html, // HTML body
  });
}

export default sendMail