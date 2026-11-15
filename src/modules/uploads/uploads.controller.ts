import type {Request, Response} from "express"
import  httpStatus from "http-status"
import catchAsync from "utils/catchAsync.js";
import sendResponse from "utils/sendResponse.js";
import uploadServices from "./uploads.service.js";
import { uploadToS3 } from "utils/uploadToS3.js";
import generateRandomString from "utils/generateRendomString.js";





const uploadSingle = catchAsync(async (req: Request, res: Response) => {
  const file = req.file
  const fileName = generateRandomString(6)
  console.log("🚀 ~ fileName:", fileName)
  // console.log("🚀 ~ file:", file)

  if(file){
    const url = await uploadToS3(file, `images/${fileName}`)
    req.body.profile = url
  }
 
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'OTP verified successfully',
    data: req.body,
  });
});
const uploadMultiple = catchAsync(async (req: Request, res: Response) => {
  console.log(req.files)
const {videos, images} = req.files as any
console.log("🚀 ~ video:", videos)
let videoUrls:string[] = []
let imageUrls:string[] = []

if(videos && videos?.length > 0){
 await Promise.all(
   videos?.map(async(video:any)=>{
    const fileName = generateRandomString(5)
    const url = await uploadToS3(video, fileName)
    videoUrls.push(url)
  })
 )
}


if(images && images?.length > 0){
 await Promise.all(
   images?.map(async(image:any)=>{
    const fileName = generateRandomString(5)
    const url = await uploadToS3(image, fileName)
    imageUrls.push(url)
  })
 )
}


req.body.images = imageUrls;
req.body.videos = videoUrls;

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'OTP verified successfully',
    data: req.body,
  });
});

 

export const uploadController = {
  uploadSingle,uploadMultiple
};


