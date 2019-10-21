import mongoose from 'mongoose';
import { DbUserModel } from '../models/user';

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    username: { type: String, unique: true },
    password: { type: String },
    registrationDate: { type: String },
    lastLogin: { type: String },
    avatarUrl: { type: String }
});

export const userDb: mongoose.Model<DbUserModel> =
  mongoose.model<DbUserModel>('User', userSchema);
