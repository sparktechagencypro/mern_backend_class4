import { Router } from "express";
import userRouter from "modules/user/user.route.js";


const router:Router = Router()

const moduleRoutes = [
    {
        path:"/user",
        route:userRouter
    }
]

moduleRoutes.forEach((route =>router.use(route.path, route.route) ))


export default router