import {PutObjectCommand} from "@aws-sdk/client-s3" 
import config from "config/index.js"
import AppError from "middleware/AppError.js"
import httpStatus from "http-status"
import s3Clint from "constant/aws.js" 

export const uploadToS3 =async (file:any, fileName:string,)=>{
    const command = new PutObjectCommand({
        Bucket: config.aws.bucket,
        Key:fileName,
        Body: file.buffer,
        ContentType: file.mimetype
    })


    try {
        
    const key = await s3Clint.send(command)


    if(!key) throw new AppError(httpStatus.BAD_REQUEST, "File upload filed!")

    const url = `https://${config.aws.bucket}.s3.${config.aws.region}.amazonaws.com/${fileName}`
    return url
    } catch (error) {
        console.error("🚀 ~ uploadToS3 ~ error:", error)
        
        throw new AppError(httpStatus.BAD_REQUEST, "File upload filed!")
    }

}


