import type { Request, Response } from 'express'; 
import { otpServices } from './otp.service.js';
import httpStatus from 'http-status';
import catchAsync from 'utils/catchAsync.js';
import sendResponse from 'utils/sendResponse.js';


const resendOtp = catchAsync(async (req: Request, res: Response) => {
  const result = await otpServices.resendOtp(req.body.email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'OTP sent successfully',
    data: result,
  });
});

export const otpControllers = {
  resendOtp,
};
