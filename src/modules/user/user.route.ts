import { Router } from "express";
import httpStatus from "http-status"
import catchAsync from "utils/catchAsync.js";
import userService from "./user.service.js";
import userController from "./user.controller.js";
const router:Router = Router()


router.post("/", userController.createUser)
router.get("/", userController.getUser)


 const userRouter = router

 export default userRouter