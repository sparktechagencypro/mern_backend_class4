import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

 

dotenv.config();

export default {
    port: process.env.PORT || 3000,
    ip: process.env.IP || "0.0.0.0",
    node_env: process.env.NODE_ENV,
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS || 12,

    nodemailer_host: process.env.NODEMAILER_HOST_EMAIL,
    nodemailer_pass: process.env.NODEMAILER_HOST_PASS
}