import  httpStatus  from 'http-status';
import AppError from 'middleware/AppError.js';
import prisma from "utils/prisma.js"
import { isPasswordValid } from './auth.utils.js';
import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken"
import config from 'config/index.js';
import bcrypt from 'bcrypt';
import { generateOTP } from 'utils/otp.js';
import moment from 'moment';
import { sendEmail } from 'utils/mailSender.js';
import path from 'path';
import fs from 'fs';


const login = async (payload: { email: string, password: string }) => {
    const user = await prisma.user.findFirst({
        where: {
            email: payload.email
        },
        include: {
            verification: {
                select:{
                    status:true
                }
            }
        }
    });

    if(!user) throw new AppError(httpStatus.BAD_REQUEST, "user not found with this email")
    if(isPasswordValid(payload.password, user.password) === false) throw new AppError(httpStatus.BAD_REQUEST, "password is incorrect");
    if(!user.verification?.status) throw new AppError(httpStatus.BAD_REQUEST, "user not verified with this email");
    if(user.isDeleted) throw new AppError(httpStatus.BAD_REQUEST, "user is deleted with this email");
    if(user.status === "blocked") throw new AppError(httpStatus.BAD_REQUEST, "user is blocked with this email");

const jwtPayload = {
    id:user.id,
    email:user.email,
    role:user.role
}

const options: any = {
  expiresIn: (config.jwt_access_expires_in || '3d') as SignOptions['expiresIn'],
};
const refreshTokenOptions: any = {
  expiresIn: (config.jwt_refresh_expires_in || '7d') as SignOptions['expiresIn'],
};
const accessToken = jwt.sign(jwtPayload, config.jwt_secret as string, options);
const refreshToken = jwt.sign(jwtPayload, config.jwt_secret as string, refreshTokenOptions);


    return {
        accessToken,
        refreshToken
    };
}

const changePassword = async (id: string, payload: { oldPassword: string, newPassword: string, confirmPassword:String }) => {

    const user = await prisma.user.findUnique({
        where: {
            id: id
        }
    });
    if(!user) throw new AppError(httpStatus.BAD_REQUEST, "user not found with this id");
    if(user.isDeleted) throw new AppError(httpStatus.BAD_REQUEST, "user is deleted with this id");
    if(user.status === "blocked") throw new AppError(httpStatus.BAD_REQUEST, "user is blocked with this id");
    if(isPasswordValid(payload.oldPassword, user.password) === false) throw new AppError(httpStatus.BAD_REQUEST, "old password is incorrect");
    if(payload.newPassword !== payload.confirmPassword) throw new AppError(httpStatus.BAD_REQUEST, "new password and confirm password do not match");
    if(payload.oldPassword === payload.newPassword) throw new AppError(httpStatus.BAD_REQUEST, "new password cannot be same as old password");
const passwordHash = await bcrypt.hash(payload.newPassword, config.salt_rounds as number);
const updatedUser = await prisma.user.update({
    where: {
        id: id
    },
    data:{
        password: passwordHash
    }
})

return {
    user:updatedUser?.name,
    email:updatedUser?.email,
    id:updatedUser?.id
}
}

const forgotPassword = async (payload: { email: string }) => {
    const user =await prisma.user.findFirst({
        where: {
            email: payload.email
        }})

    if(!user) throw new AppError(httpStatus.BAD_REQUEST, "user not found with this email");
    if(user.isDeleted) throw new AppError(httpStatus.BAD_REQUEST, "user is deleted with this email");
    if(user.status === "blocked") throw new AppError(httpStatus.BAD_REQUEST, "user is blocked with this email");
   const jwtPayload = {
    id:user.id,
    email:user.email,
    role:user.role
}

const otpToken = jwt.sign(jwtPayload, config.jwt_secret as string, { expiresIn: "3m" });
const otp = generateOTP();
const expirationTime = moment().utc().add(3, 'm'); 
const updatedUser = await prisma.user.update({
    where: {
        id: user.id
    },
    data:{
    needToPasswordChange:true,
verification:{
   update:{
  data:{
      otp:Number(otp), 
    expiredAt:expirationTime.toDate()
  }
   }
}
    },
include:{
    verification:true
}    
    })


    const otpEmailPath = path.join(
      __dirname,
      '../../../public/view/forget_pass.html',
    );

    await sendEmail(
      user?.email,
      "Reset Your Password",
      fs
        .readFileSync(otpEmailPath, 'utf8')
        .replace('{{user_name}}', user.name)
        .replace('{{otp_code}}', otp),
    );

 return {
    otpToken,
    user:{
        name:user.name,
        email:user.email,
        id:user.id
    }
 }


}

const resetPassword = async (id:string, payload: { newPassword: string, confirmPassword:String }) => {
    const user = await prisma.user.findUnique({
        where: {
            id:id
        },})

    if(!user) throw new AppError(httpStatus.BAD_REQUEST, "user not found with this id");
    if(user.isDeleted) throw new AppError(httpStatus.BAD_REQUEST, "user is deleted with this id");
    if(user.status === "blocked") throw new AppError(httpStatus.BAD_REQUEST, "user is blocked with this id");

    if(payload.newPassword !== payload.confirmPassword) throw new AppError(httpStatus.BAD_REQUEST, "new password and confirm password do not match");

    const passwordHash = await bcrypt.hash(payload.newPassword, config.salt_rounds as number);

    const updatedUser = await prisma.user.update({
        where: {
            id: id
        },
        data: {
            password: passwordHash,
            needToPasswordChange: false
        }
    });

    return {
        user: {
            name: updatedUser.name,
            email: updatedUser.email,
            id: updatedUser.id
        }
    };
}
const authService = {
    login,
    changePassword,
    forgotPassword,
    resetPassword
}



export default authService