import {Request,Response, NextFunction } from "express"
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt"
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "./userTypes";


const createUser=async (req:Request, res:Response, next:NextFunction)=>{
    //validation
    const {name,email,password}=req.body;

    if(!name || !email || !password){
        const error=createHttpError(400,"All fields are Required")
        return next(error);
     }
      //Database call,
      try {
        const user = await userModel.findOne({ email });
        if (user) {
          const error = createHttpError(
            400,
            "User already exists with this email."
          );
          return next(error);
        }
      } catch (err) {
        return next(createHttpError(500, "Error while getting user"));
      }
    
      //password-> hash
    const hashedPassword=await bcrypt.hash(password,10)

    const newUser=await userModel.create({
        
        name,
        email,
        password: hashedPassword,
    });

    //token generation
     const token=sign({sub: newUser._id},config.jwtSecret as string,{expiresIn:'7d' })
    //process

    //response
    res.json({accessToken: token});
}


export {createUser};