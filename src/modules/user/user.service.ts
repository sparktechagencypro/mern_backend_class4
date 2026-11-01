 import AppError from "middleware/AppError.js"
import httpStatus from "http-status"
import type { Prisma } from "@prisma/browser.js"
import prisma from "utils/prisma.js"
import bcrypt from "bcrypt"
import config from "config/index.js"

const createUser = async(payload: Prisma.UserCreateInput)=>{
   const {name, email, password, role} = payload
   const isExists  = await prisma.user.findFirst({
    where:{
        email:email
    }
   })
    if(isExists){
        throw new AppError(httpStatus.BAD_REQUEST, "user already easiest")
    }

    payload.password = await bcrypt.hash(password, config.bcrypt_salt_rounds)

    
    const result = await prisma.user.create({data:payload})

    if(!result) throw new AppError(httpStatus.BAD_REQUEST, "user creation failed!")
    return result
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