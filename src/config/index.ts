import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

 

dotenv.config();

export default {
    port: process.env.PORT || 3000,
    ip: process.env.IP || "0.0.0.0"
}