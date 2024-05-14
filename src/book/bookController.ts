import { Response,NextFunction, Request } from "express";

const createBook=async (req:Request, res:Response, next:NextFunction)=>{
    const {}=req.body
   res.json({})
}

export {createBook};