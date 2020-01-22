import mongoose from "mongoose";

export type BookModel = mongoose.Document & {
    title: string,
    author: string,
    price: number
};


const BookSchema = new mongoose.Schema({
    title: String,
    author: String,
    price: Number
})

export const Book = mongoose.model<BookModel>("Book", BookSchema)