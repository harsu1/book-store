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
    const hashedPassword=await bcrypt.hash(password,10);

    let newUser: User;

try{
     newUser=await userModel.create({
        
        name,
        email,
        password: hashedPassword,
    });
}
catch(err){
   return next(createHttpError(500,"Error while creating user ."));
}
try {
     //token generation
     const token=sign({sub: newUser._id},config.jwtSecret as string,{expiresIn:'7d' })
    //process

    //response
    res.status(201).json({accessToken: token});
} catch (error) {
    return next(createHttpError(500, "Error while signing the jwt token"))
}

}

const loginUser=async(req:Request, res:Response, next:NextFunction)=>{

    const {email, password}=req.body;

    if(!email || !password){
        return next(createHttpError(400,"All fields Required"))
    }
    const user=await userModel.findOne({email});

    if(!user){
        return next(createHttpError(404,"User not found."));
    }
    const isMatch=await bcrypt.compare(password, user.password)

    if(!isMatch){
        return next(createHttpError(401, "Username or password incorrect!"))
    }
    //create Accestoken\
    const token = sign({ sub: user._id }, config.jwtSecret as string, {
        expiresIn: "7d",
        algorithm: "HS256",
      });
    

    res.json({accessToken:token})
}


export {createUser,loginUser};