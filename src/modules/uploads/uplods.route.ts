import { Router } from "express";
import { uploadController } from "./uploads.controller.js";
import multer, { memoryStorage } from "multer"
import { uploadMultiple, uploadSingle } from "middleware/upload.js"; 
import parseData from "middleware/parseData.js";

const uploads = multer({storage: memoryStorage()})
const multiUpload = [{name:"images", maxCount:5 }, {name:"videos", maxCount:2}, ]
const router = Router()
// uploadSingle("file", "/files"),

router.post("/single", uploads.single("file"),   uploadController.uploadSingle)
router.post("/multiple",uploads.fields(multiUpload), 
// parseData(), 
// uploadMultiple(multiUpload),  

uploadController.uploadMultiple)
  
const uploadRoutes = router;
export default uploadRoutes