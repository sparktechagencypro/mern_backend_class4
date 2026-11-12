import { Router } from "express"; 
import userController from "./user.controller.js"; 
import multer, { memoryStorage } from "multer";
import { uploadSingle } from "middleware/upload.js";
const router:Router = Router()

const uploads = multer({storage:memoryStorage()})
router.post("/", 
    // validateRequest(userValidationSchema.create),
      userController.createUser)
router.get("/", userController.getUser)
// router.get("/",uploads.single("profile"), uploadSingle("profile"),  userController.upserupdate)


 const userRouter = router

 export default userRouter