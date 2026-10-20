import AppError from "middleware/AppError.js"
import httpStatus from "http-status"
import type { Prisma } from "@prisma/browser.js"
import prisma from "utils/prisma.js"

const createUser = async(payload: Prisma.UserCreateInput)=>{
    // const createUser = prisma.user.create({
        
    //     data:payload
    
    // })

    // if(!createUser){
    //     throw new AppError(httpStatus.BAD_GATEWAY, "user creation failed!")
    // }
   

    return createUser
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