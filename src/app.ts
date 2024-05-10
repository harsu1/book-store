import express, { NextFunction, Request,Response } from 'express'
 import globaErrorHandler from './middleware/globalErrorHandler';


const app=express();

//routes

//Http method
app.get('/', (req, res, next)=>{
    res.json({message: "welcome to aou api"})
});

//GLobal error Handler

app.use(globaErrorHandler);




export default app;