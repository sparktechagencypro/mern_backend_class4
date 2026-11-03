import { Router } from "express";
import { authController } from "./auth.controller.js";
import auth from "middleware/auth.js";
import { Role } from "@prisma/enums.js";

const router = Router()

router.post('/login', authController.login)
router.post('/forgot-password', authController.forgotPassword)


router.patch('/change-password', 
    auth(Role.admin, Role.supper_admin, Role.sub_admin, Role.user),
     authController.changePassword)
router.patch('/reset-password',auth(Role.admin, Role.supper_admin, Role.sub_admin, Role.user),
 authController.resetPassword)

const authRoutes = router

export default authRoutes