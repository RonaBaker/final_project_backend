import mongoose from 'mongoose';

export interface UserProfile {
    email: string,
    username: string,
    registrationDate: string,
    lastLogin: string,
    avatarUrl: string
}

export interface User extends UserProfile {
    password: string,
}

export interface DbUserModel extends User, mongoose.Document {
    id: string;
  }