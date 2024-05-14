import express, { NextFunction, Request,Response } from 'express'
 import globaErrorHandler from './middleware/globalErrorHandler';
import userRouter from './user/userRouter';
import bookRouter from './book/bookRouter';


const app=express();
app.use(express.json());

//routes

//Http method
app.get('/', (req, res, next)=>{
    res.json({message: "welcome to aou api"})
});

app.use('/api/users',userRouter)

app.use('/api/books',bookRouter)
//GLobal error Handler

app.use(globaErrorHandler);




export default app;