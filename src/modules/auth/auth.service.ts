import  httpStatus  from 'http-status';
import AppError from 'middleware/AppError.js';
import prisma from "utils/prisma.js"
import { isPasswordValid } from './auth.utils.js';
import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken"
import config from 'config/index.js';


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

const authService = {
    login
}

export default authService