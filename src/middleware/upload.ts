import catchAsync from "utils/catchAsync.js"
import { uploadToS3 } from "utils/uploadToS3.js"
import _ from "lodash"
import generateRandomString from "utils/generateRendomString.js"
import { promise } from "zod"

 
interface IMultipleParams {
     name:string,
     maxCount:number,
     path?:string,
}

const uploadSingle =  (name:string, path?:string) =>{


    return catchAsync(async(req, res, next)=>{
if(req.file){
    const filePath = path ? `${path}/${generateRandomString(5)}` : generateRandomString(5)
 req.body[name] = await uploadToS3(req.file, filePath ) 
}
        next()
})
} 
/*[
{name:"images", maxCount:5 , path:""},

 
 */
const uploadMultiple =(files:IMultipleParams[])=> {
    // [{name:"images", maxCount:5, path?:"images/" }, {name:"video", maxCount:2}, ]: []
  
    return catchAsync(async(req, res, next)=>{
 


    if(_.isEmpty(files)) return next()


        await Promise.all(
            _.map(files,async(filed)=>{


               const fieldFiles = _.get(req.files, filed.name)  
               

               if(!fieldFiles || fieldFiles?.length === 0)  return

                    const filePath = filed?.path ? `${filed?.path}/${Math.floor(100000 + Math.random() * 900000)}` : `${Math.floor(100000 + Math.random() * 900000)}`
               const uploadedUrls:any[] = []
               
                    await Promise.all(
                fieldFiles.map(async(file:any)=>{
                    const uploadUrl = await uploadToS3(file,filePath ) 
                    // _.set(uploadedUrls, uploadUrl)
                    uploadedUrls.push(uploadUrl)
                })



               )

               _.set(req.body, filed.name, uploadedUrls)
            })
        )

        next()
});
}

export {
    uploadSingle,uploadMultiple
}