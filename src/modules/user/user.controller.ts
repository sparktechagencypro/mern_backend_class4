import catchAsync from "utils/catchAsync.js";
import userService from "./user.service.js";
import sendResponse from "utils/sendResponse.js";
import httpStatus from "http-status"
import { otpServices } from "modules/otp/otp.service.js";

const createUser = catchAsync(async(req, res, next)=>{
   
const result = await userService.createUser(req.body)
const sendOtp = await otpServices.resendOtp({email:result.email})
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success:true, 
        message:"user create successfully",
        data: {
            sendOtp
        }
    })
})


const getUser = catchAsync(async(req, res, next)=>{
   
const result = await userService.getUser()

sendResponse(res, {
    statusCode: httpStatus.OK,
    success:true, 
    message:"user fetch successfully",
    data: result
})
})






const userController = {
    getUser,
    createUser
}

export default userController