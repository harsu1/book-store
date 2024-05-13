import {Request,Response, NextFunction } from "express"
import createHttpError from "http-errors";
import userModel from "./userModel";

const createUser=async (req:Request, res:Response, next:NextFunction)=>{
    //validation
    const {name,email,password}=req.body;

    if(!name || !email || !password){
        const error=createHttpError(400,"All fields are Required")
        return next(error);
     }
      //Database call,
      const user=await userModel.findOne({email})

      if(user){
        const error=createHttpError(400, "User already exists with this email ")
        return next(error);
      }
    //process

    //response
    res.json({message:"User created"})
}


export {createUser};