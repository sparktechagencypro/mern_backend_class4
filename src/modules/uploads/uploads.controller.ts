import type {Request, Response} from "express"
import  httpStatus from "http-status"
import catchAsync from "utils/catchAsync.js";
import sendResponse from "utils/sendResponse.js";
import uploadServices from "./uploads.service.js";





const uploadSingle = catchAsync(async (req: Request, res: Response) => {
 
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'OTP verified successfully',
    data: req.body,
  });
});
const uploadMultiple = catchAsync(async (req: Request, res: Response) => {

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'OTP verified successfully',
    data: req.body,
  });
});

 

export const uploadController = {
  uploadSingle,uploadMultiple
};


