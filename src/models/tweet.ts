import mongoose from 'mongoose';

export interface TweetDb {
    tweetId: string,
    username: string,
    content: string,
    date: string,
    stars: number,
    avatarUrl: string
}

export interface Tweet extends TweetDb {

    starredBy: string[],
}

export interface DbTweetModel extends Tweet, mongoose.Document {
    id: string;
}

export interface TweetRes extends TweetDb {
    starredByMe: string
}
