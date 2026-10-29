import httpStatus from 'http-status';
import moment from 'moment'; 
import path from 'path';
import fs from 'fs'; 
import AppError from 'middleware/AppError.js';
import prisma from 'utils/prisma.js';
import { generateOtp } from 'utils/otpGenerator.js';
import { sendEmail } from 'utils/mailSender.js';

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
 return updateOtp
  } catch (error: any) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error?.message);
  }
}; 

export const otpServices = { 
  resendOtp,
};
