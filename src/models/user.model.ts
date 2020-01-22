import mongoose, { Schema, model } from 'mongoose'

export type UserModel = mongoose.Document & {
    email: string;
    fullName: string;
    password: string;
    role: number
};

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    password: { type: String, required: true },
    role: Number
})

export const User = model<UserModel>("User", UserSchema)