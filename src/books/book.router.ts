import { BookModel } from './../models/book.model';
import { MESSAGE } from '../shared/constants/bookApi.constants';
import { Router, Request, Response, NextFunction } from "express";
import { Book } from '../models/book.model'
import { MongooseDocument } from 'mongoose';
import { HttpException } from "../core/common/http-exception";





export const itemsRouter = Router();

itemsRouter.get(
    "/",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await Book.find({}, (error: Error, book: MongooseDocument) => {
                if (error) {
                    throw new HttpException(["ERROR!"]);;
                }
                res.json(book)
            });
           
        } catch (e) {
            next(e)
        }
    }
)


itemsRouter.post(
    "/add",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const newBook:BookModel = new Book(req.body);
            await newBook.save((error: Error, book: MongooseDocument) => {
                if (error) {
                    throw new HttpException(["ERROR!"]);;
                }
                res.json(book)
            })
        } catch (e) {
            next(e)
        }

    }
)

itemsRouter.delete(
    "/:id",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const bookID = req.params.id;
            await Book.findByIdAndDelete(bookID, (error: Error, deleted: any) => {
                if (error) {
                    res.send(error);
                }
                const message = deleted ? MESSAGE.BOOK_DELETED_SUCCESSFULLY : MESSAGE.BOOK_NOT_FOUND;
                res.send(message);
            })
        } catch (e) {
            next(e)
        }

    }
)

itemsRouter.put(
    "/:id",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const bookID = req.params.id;
            await Book.findByIdAndUpdate(
                bookID,
                req.body,
                (error: Error, book: any) => {
                    if (error) {
                        res.send(error);
                    }
                    const message = book ? MESSAGE.BOOK_UPDATED_SUCCESSFULLY :  MESSAGE.BOOK_NOT_FOUND;
                    res.send(message);
                }
            )
        } catch (e) {
            next(e)
        }

    }
)