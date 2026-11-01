import dotenv from "dotenv" 
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url); 

 

dotenv.config();

export default {
    port: process.env.PORT || 3000,
    ip: process.env.IP || "0.0.0.0",
    node_env: process.env.NODE_ENV, 

    nodemailer_host: process.env.NODEMAILER_HOST_EMAIL,
    nodemailer_pass: process.env.NODEMAILER_HOST_PASS,
    salt_rounds: process.env.SALT_ROUNDS || 12,
    nodemailer_host_email:process.env.NODEMAILER_HOST_MAIL,
    nodemailer_host_pass:process.env.NODEMAILER_HOST_MAIL
}