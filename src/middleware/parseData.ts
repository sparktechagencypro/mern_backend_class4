import  catchAsync from "utils/catchAsync.js";

const parseData =()=>catchAsync(async(req, res, next)=>{
if(req.body.data){
    req.body = JSON.parse(req.body.data)
}


next()
})

export default parseData