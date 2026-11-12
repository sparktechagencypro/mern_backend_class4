import { Router } from "express";
import authRoutes from "modules/auth/auth.route.js";
import { otpRoutes } from "modules/otp/otp.routes.js";
import uploadRoutes from "modules/uploads/uplods.route.js";
import userRouter from "modules/user/user.route.js";


const router:Router = Router()

const moduleRoutes = [
    {
        path:"/user",
        route:userRouter
    },
    {
        path:"/otp",
        route:otpRoutes
    },
    {
        path:"/auth",
        route:authRoutes
    },
    {
        path:"/uploads",
        route:uploadRoutes
    }
]

moduleRoutes.forEach((route =>router.use(route.path, route.route) ))


export default router