import express from 'express'


const app=express();

//routes

//Http method
app.get('/', (req, res, next)=>{
    res.json({message: "welcome to aou api"})
})




export default app;