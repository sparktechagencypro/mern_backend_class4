import catchAsync from "utils/catchAsync.js";
import userService from "./user.service.js";
import sendResponse from "utils/sendResponse.js";
import httpStatus from "http-status"

const createUser = catchAsync(async(req, res, next)=>{
   
const result = await userService.createUser(req.body)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success:true, 
        message:"user create successfully",
        data: result
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