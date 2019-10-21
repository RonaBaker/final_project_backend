import mongoose from 'mongoose';
import { DbTweetModel } from '../models/tweet';

const tweetSchema = new mongoose.Schema({
    tweetId: { type: String },
    username: { type: String },
    content: { type: String },
    date: { type: String },
    stars: { type: Number },
    starredBy: [String],
    avatarUrl: { type: String }
});

export const tweetDb: mongoose.Model<DbTweetModel> =
  mongoose.model<DbTweetModel>('Tweet', tweetSchema);
