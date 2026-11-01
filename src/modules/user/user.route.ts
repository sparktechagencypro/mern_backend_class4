import { Router } from "express";
import httpStatus from "http-status"
import catchAsync from "utils/catchAsync.js";
import userService from "./user.service.js";
import userController from "./user.controller.js";
import validateRequest from "middleware/validateRequest.js";
import userValidationSchema from "./user.validation.js";
const router:Router = Router()


router.post("/create", 
    // validateRequest(userValidationSchema.create), 
     userController.createUser)
router.get("/", userController.getUser)


 const userRouter = router

 export default userRouter