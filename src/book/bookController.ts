import { Response, NextFunction, Request } from "express";
import cloudinary from "../config/cloudinary";
import path from "path";
import { log } from "console";
import createHttpError from "http-errors";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
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

  console.log("uploadResult", uploadResult);
  console.log('bookFileUploadResult',bookFileUploadResult);
}
catch(err){
    console.log(err);
    return next(createHttpError(500,'Error while uploading the files'))
    
}
  

  res.json({});
};

export { createBook };