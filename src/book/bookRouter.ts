import express from "express";
import { createBook, deleteBook, getsingleBook, listBooks, updateBook } from "./bookController";
import multer from "multer";
import path from "path";
import authenticate from "../middleware/authenticate";

const bookRouter = express.Router();

//file store local
const upload = multer({
  dest: path.resolve(__dirname, "../../public/data/uploads"),
  limits: { fileSize: 3e7 },
});

//routes
bookRouter.post(
  "/",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createBook
);

bookRouter.patch(
    "/:bookId",
    authenticate,
    upload.fields([
      { name: "coverImage", maxCount: 1 },
      { name: "file", maxCount: 1 },
    ]),
    updateBook
  );

  bookRouter.get('/',listBooks)
  bookRouter.get('/:bookId',  getsingleBook)

  bookRouter.delete('/:bookId',authenticate, deleteBook)


export default bookRouter;
