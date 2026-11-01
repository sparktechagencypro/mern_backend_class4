import type { Prisma } from '@prisma/browser.js';
import  httpStatus  from 'http-status';
import AppError from "middleware/AppError.js"
import moment from 'moment';
import sendMail from 'utils/nodemailer.js';
import { generateOTP } from 'utils/otp.js';
import prisma from "utils/prisma.js"
import path from "path"
import fs from "fs"

const reSendOtp = async(email:string)=>{
    const user = await prisma.user.findFirst({
     where:{
        email:email
     }

    })

    if(!user) throw new AppError(httpStatus.BAD_REQUEST, "user not found!")

    const otp = generateOTP() 
    const expiredAt = moment().add("m", 3).toDate()

    const result = await prisma.user.update({
        where:{
            id:user.id
        }, 
        data:{
            verification:{
                update:{
                    otp: Number(otp), 
                    expiredAt
                }
            }
        }, 
        include:{
            verification: true
        }
    })

    


     const otpTemp = path.join("../../../public/view/verification.html")
       const html = fs
      .readFileSync(otpTemp, 'utf8')
      .replace('{{name}}', user?.name)
      .replace('{{otp}}', otp) 
      
 sendMail({
        to:email, 
        subject:"Verification otp",
        text:"",
        html:html
     })

    return result
// const otpData:Prisma.VerificationCreateInput = {
//  otp: Number(otp), 
//             expiredAt
// }
//     const createOtp = await prisma.verification.update({
//         where:{
//             userId:user.id
//         },
//         data:otpData 
//     })
}