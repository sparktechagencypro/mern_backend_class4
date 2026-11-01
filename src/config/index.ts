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
    nodemailer_host_email:process.env.NODEMAILER_HOST_EMAIL,
    nodemailer_host_pass:process.env.NODEMAILER_HOST_PASS,
    jwt_secret: process.env.JWT_SECRET,
    jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN || '3d',
    jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
}