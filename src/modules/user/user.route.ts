import { Router } from "express";
import httpStatus from "http-status"
const router:Router = Router()


router.get("/", (req, res)=>{
    res.status(httpStatus.OK).json([{
        name:"Jon", 
        age:50
    }])
} )



 const userRouter = router

 export default userRouter