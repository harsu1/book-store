import { Response, NextFunction, Request } from "express";
 
import cloudinary from "../config/cloudinary";
import path from "path";
import { log } from "console";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import fs from "node:fs";
import authenticate, { AuthRequest } from "../middleware/authenticate";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
    const {title,genre}=req.body;

  const files = req.files as { [filename: string]: Express.Multer.File[] };

  const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
  const filename = files.coverImage[0].filename;
  const filePath = path.resolve(
    __dirname,
    "../../public/data/uploads",
    filename
  );

  try{const uploadResult = await cloudinary.uploader.upload(filePath, {
    filename_override: filename,
    folder: "book-cover",
    format: coverImageMimeType,
  });

  const bookFileName = files.file[0].filename;
  const bookFilePath = path.resolve(
    __dirname,
    "../../public/data/uploads",
    bookFileName
  );
  

  const bookFileUploadResult=await cloudinary.uploader.upload(bookFilePath,{
     resource_type:"raw",
     filename_override:bookFileName,
     folder:"book-pdfs",
     format: "pdf",
  });

  const _req=req as AuthRequest
   

  const newBook=await bookModel.create({
    title,
    genre,
    author:_req.userId,
    coverImage:uploadResult.secure_url,
    file:bookFileUploadResult.secure_url,

  })
 await fs.promises.unlink(filePath)
 await fs.promises.unlink(bookFilePath)
  res.status(201).json({id:newBook._id})
}
catch(err){
    console.log(err);
    return next(createHttpError(500,'Error while uploading the files'))
    
}
  

  res.json({});
};

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, description, genre } = req.body;
  const bookId = req.params.bookId;

  const book = await bookModel.findOne({ _id: bookId });

  if (!book) {
      return next(createHttpError(404, "Book not found"));
  }
  // Check access
  const _req = req as AuthRequest;
  if (book.author.toString() !== _req.userId) {
      return next(createHttpError(403, "You can not update others book."));
  }

  // check if image field is exists.

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  let completeCoverImage = "";
  if (files.coverImage) {
      const filename = files.coverImage[0].filename;
      const converMimeType = files.coverImage[0].mimetype.split("/").at(-1);
      // send files to cloudinary
      const filePath = path.resolve(
          __dirname,
          "../../public/data/uploads/" + filename
      );
      completeCoverImage = filename;

      const uploadResult = await cloudinary.uploader.upload(filePath, {
        filename_override: completeCoverImage,
        folder: "book-covers",
        format: converMimeType,
    });

    completeCoverImage = uploadResult.secure_url;
    await fs.promises.unlink(filePath);
}

// check if file field is exists.
let completeFileName = "";
if (files.file) {
    const bookFilePath = path.resolve(
        __dirname,
        "../../public/data/uploads/" + files.file[0].filename
    );

    const bookFileName = files.file[0].filename;
    completeFileName = bookFileName;

    const uploadResultPdf = await cloudinary.uploader.upload(bookFilePath, {
        resource_type: "raw",
        filename_override: completeFileName,
        folder: "book-pdfs",
        format: "pdf",
    });
    completeFileName = uploadResultPdf.secure_url;
    await fs.promises.unlink(bookFilePath);
}

const updatedBook = await bookModel.findOneAndUpdate(
    {
        _id: bookId,
    },
    {
        title: title,
        description: description,
        genre: genre,
        coverImage: completeCoverImage
            ? completeCoverImage
            : book.coverImage,
        file: completeFileName ? completeFileName : book.file,
    },
    { new: true }
);

res.json(updatedBook);
};

const listBooks=async(req: Request, res: Response, next: NextFunction)=>{
  try {

    const book = await bookModel.find()
       res.json(book)

  } catch (err) {
     return next(createHttpError(500,"Error hile getting a book"))
  }
}

const getsingleBook=async(req: Request, res: Response, next: NextFunction)=>{
  const bookId=req.params.bookId
  try {
    const book=await bookModel.findOne({_id:bookId})
    if(!book){
      return next(createHttpError(404,"book not found"))
    }

    return res.json(book);
  } catch (err) {
    return next(createHttpError(500,"error hile getting book"))
  }
}
export { createBook,updateBook,listBooks,getsingleBook };
