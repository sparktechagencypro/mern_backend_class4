import express, { type Application, } from 'express'
import path from 'path';
import { fileURLToPath } from 'url'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import notFound from 'middleware/notfound.js';
import router from 'routes/routes.js';
 
const app:Application = express()

// const _filename = fileURLToPath(import.meta.url)    
// const __dirname = path.dirname(__filename);


// app.use(express.static(path.join(__dirname, '../public')));
// app.set('views', path.join(__dirname, '../public/view/'));


app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));


app.use(express.json())
app.use(cookieParser())

app.use(
    cors({
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT',"PATCH", 'DELETE'],
    })
)

app.use("/api/v1", router)

app.get("/", (req, res)=>{
res.send("Server is running")
})


app.use(notFound)

export default app