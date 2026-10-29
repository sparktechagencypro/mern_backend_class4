import AppError from "middleware/AppError.js"
import httpStatus from "http-status"
import type { Prisma } from "@prisma/browser.js"
import prisma from "utils/prisma.js"
import bcrypt from 'bcrypt';
import config from "config/index.js";

const createUser = async(payload: Prisma.UserCreateInput)=>{
   try {
    const isExist = await prisma.user.findFirst({
      where: {
        email: payload.email,
      },
      include: {
        verification: {
          select: {
            status: true,
          },
        },
      },
    });

    payload['password'] =  await bcrypt.hash(payload.password, Number(config.salt_rounds));

    if (isExist) { 
      throw new AppError(
        httpStatus.CONFLICT,
        'User already exists and is verified',
      );
    }
    const result = await prisma.user.create({ data: payload });

    return result;
  } catch (error: any) {
    throw new AppError(httpStatus?.BAD_GATEWAY, error?.message);
  }
}



const getUser = async()=>{
    const data =  null
    //  [{
    //     id:1,
    // name:"Jon do"
    // }]

    if (!data){
        throw new AppError(httpStatus.NOT_FOUND, "User Data Not found")
    }
    return data
}


const userService ={
    getUser, 
    createUser
}

export default userService