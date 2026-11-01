import httpStatus from 'http-status';
import moment from 'moment'; 
import path from 'path';
import fs from 'fs'; 
import AppError from 'middleware/AppError.js';
import prisma from 'utils/prisma.js';
import { generateOtp } from 'utils/otpGenerator.js';
import { sendEmail } from 'utils/mailSender.js';
import jwt, { type JwtPayload } from "jsonwebtoken"
import config from 'config/index.js';

const resendOtp = async (payload: { email: string }) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: payload?.email,
      },
    });

    if (!user)
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'you are not registered with this mail',
      );

    const otp = generateOtp();
    const expiresAt = moment().utc().add(3, 'minute');

    const updateOtp = await prisma.verification.upsert({
      where: {
        userId: user.id,
      },
      update: {
        otp: Number(otp),
        expiredAt: expiresAt.toDate(),
        status: false,
      },

      create: {
        userId: user.id,
        otp: Number(otp),
        expiredAt: expiresAt.toDate(),
        status: false,
      },
    });

    if (!updateOtp)
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to resend OTP. Please try again later',
      );

      const otpPayload = {
        id:user.id,
        email:user.email,
      }

      const token =jwt.sign(otpPayload, config.jwt_secret as string, {
        expiresIn: '3m',
      });


    const otpEmailPath = path.join(
      __dirname,
      '../../../public/view/verification.html',
    );

    await sendEmail(
      user?.email,
      'Your One Time OTP',
      fs
        .readFileSync(otpEmailPath, 'utf8')
        .replace('{{otp}}', otp)
        .replace('{{email}}', user?.email),
    );
 return {
  token:token,
 }
  } catch (error: any) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error?.message);
  }
}; 

const verifyOtp = async (token: string, otp: number) => {
  if(!token){
    throw new AppError(httpStatus.UNAUTHORIZED, "token is required");
  }
let decodedData: JwtPayload;

  try{
  decodedData = jwt.verify(token, config.jwt_secret as string) as JwtPayload;

  }catch (error: any) {
    throw new AppError(httpStatus?.INTERNAL_SERVER_ERROR, error?.message ||"server internal error");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: decodedData?.id as string,
    },
    include:{
      verification:true
    }
  });

  if (!user)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'you are not registered with this mail',
    );

if(user?.verification?.expiredAt && moment().utc().isAfter(moment(user?.verification?.expiredAt)))
  throw new AppError(httpStatus.BAD_REQUEST, "OTP has expired. Please request a new OTP.");

if(user?.verification?.otp !== otp)
  throw new AppError(httpStatus.BAD_REQUEST, "Invalid OTP. Please try again.");

const result = await prisma.user.update({
  where:{

    id:user?.id
  }, 
  data:{
verification:{
update:{
  status:true
  
}
}
  },
  include:{
    verification:true
  }
})


return {
  id:result?.id,
  email:result?.email,
}

}

export const otpServices = { 
  resendOtp,
  verifyOtp
};
