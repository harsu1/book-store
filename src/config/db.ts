import mongoose from 'mongoose';
import { config } from './config';
 

const connectDB=async()=>{
    try{

         mongoose.connection.on('connected',()=>{
            console.log("connected Successfully to database");
            
         });

         mongoose.connection.on('error',(err)=>{
            console.log('Error in connecting database', err);
            
         })
         await mongoose.connect(config.databaseUrl as string);

       }
 
       catch(err){
               console.error("Failed to connect to database",err);
               process.exit(1);
               
       }
    }
  
export default connectDB