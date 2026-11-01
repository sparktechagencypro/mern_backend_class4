import config from "config/index.js"
import type { ErrorRequestHandler } from "express"
import type { TErrorSources } from "interface/error.js"
import AppError from "./AppError.js"
import { ZodError } from "zod" 
import handleZodError from "./zodError.js"

const globalErrorHandler:ErrorRequestHandler = (err, req, res, next)=>{
    let statusCode = 500
    let message = "Something went wrong!"
    let errorSources:TErrorSources[] = [
        {
            path:"",
            message:"Something went wrong!"
        }
    ]
if(err instanceof AppError){
    statusCode = err?.statusCode
    message = err?.message
    errorSources = [
        {
            path:"",
            message:err.message
        }
    ]

}
else
if(err instanceof ZodError){
   const simplifiedError = handleZodError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
}
else if(err instanceof Error){
        message = err.message
        errorSources = [
            {
                path:"",
                message:err.message
            }
        ]


    }


    if(errorSources?.length !==0){
        errorSources = errorSources?.map(source=>{
            try {
                return {
                    ...source,
                    message: source.message
                }
            } catch (error) {
                return {
                    ...source,
                    message: source.message
                }
            }
        })
    }


    try {
        res.status(statusCode).json({
            success:false, 
            message,
            errorSources:errorSources,
            err, 
            stack: config.node_env === "development" ? err?.stack : null
        })
    } catch (error) {
         res.status(statusCode).json({
      success: false, 
      message: message,
      errorSources,
      err,
      stack: config.node_env === 'development' ? err?.stack : null,
    });
    }

}




export default globalErrorHandler