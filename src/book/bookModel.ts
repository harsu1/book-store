import mongoose from "mongoose";
import { title } from "process";
import { Book } from "./bookTypes";

const bookSchema=new mongoose.Schema({
    title:{
        type: String,
        required:true,
    },
    description: {
        type: String,
        require: true,
    },
    author:{
       type:mongoose.Schema.Types.ObjectId,
       ref:"User",
       required: true,
    },
    coverImage:{
          type: String,
          required: true,
    },
    file:{
       type:String,
       required: true,

    },
    genre:{
        type: String,
        required: true
    },
    
},
{timestamps: true}
);

export default mongoose.model<Book>('Book',bookSchema )