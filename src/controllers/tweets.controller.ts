import { Request, Response, NextFunction } from 'express';
import { Tweet, TweetRes, } from '../models/tweet';
import { tweetDb } from '../store/tweets';
import uuidv1 from 'uuid/v1';
import jwt from 'jsonwebtoken';
import { userDb } from '../store/users';
import { User } from '../models/user';
import { ReversedToken } from '../middlewares/auth';

export async function postTweet(req: Request, res: Response, next: NextFunction) {
    try {
        const content: string = req.body.tweetContent;
        const username = res.locals;
        const user = await userDb.findOne({ username: username }).exec();
        let avatarUrl = (user as User).avatarUrl;
        let url = req.protocol + '://' + req.get('host') + '/public/defaultprofile.png'; // in case no user found, set default profile picture
        if (!avatarUrl) {
            avatarUrl = url;
        }
        const tweet: Tweet = {
            tweetId: uuidv1(),
            username: username,
            content: content,
            date: new Date().toLocaleDateString(),
            stars: 0,
            starredBy: [],
            avatarUrl: avatarUrl
        }
        await tweetDb.insertMany(tweet);
        res.status(201).send(tweet);
    }
    catch (error) {
        next(new Error(error));
    }
}

export async function getTweets(req: Request, res: Response, next: NextFunction) {
    try {
        const token = (req.headers.authorization as string).split(" ")[1];
        if (token !== 'undefined') { // check if access token is provided, then returns starredByMe
            try {
                const reversedToken = jwt.verify(token, 'MY_SECRET_JWT');
                const username = (reversedToken as ReversedToken).username;
                await tweetDb.find().sort({ date: -1 }).exec().then(tweetsRes => {
                    let tweets: TweetRes[] = [];
                    for (let element of tweetsRes) {
                        if (element.starredBy.find(username => username === username) !== undefined) {
                            tweets.push(createTweetObject(username, element));
                        }
                        else {
                            tweets.push(createTweetObject('', element));
                        }
                    }
                    return res.status(200).send(tweets);
                })
            }
            catch { // if token isn't verified return tweets anyway
                const tweets = await tweetDb.find().sort({ date: -1 }).exec();
                return res.status(200).send(tweets);
            }

        }
        else { // access token is not provided
            const tweets = await tweetDb.find().sort({ date: -1 }).exec();
            return res.status(200).send(tweets);
        }
    }
    catch (error) {
        next(new Error(error));
    }
}


export async function deleteTweet(req: Request, res: Response, next: NextFunction) {
    const tweetId = req.params.id;
    const username = res.locals;
    try {
        const tweet = await tweetDb.findOne({ tweetId: tweetId }).exec();
        if (!tweet) { // Tweet not found
            return res.sendStatus(404);
        }
        if ((tweet as Tweet).username !== username) { // User not the owner
            return res.sendStatus(403);
        }
        const deleted = await tweetDb.deleteOne({ tweetId: tweetId }).exec();
        if (!deleted) {
            return res.sendStatus(404);
        }
        res.sendStatus(204);
    }
    catch (error) {
        next(new Error(error));
    }
}

export async function starToggle(req: Request, res: Response, next: NextFunction) {
    const tweetId = req.params.id;
    const username = res.locals;
    try {
        const tweet = await tweetDb.findOne({ tweetId: tweetId }).exec();
        if (!tweet) {
            return res.sendStatus(404);
        }
        const starredBy: string[] = tweet.starredBy;
        let starredByMe;
        if (starredBy.findIndex(u => u === username) !== -1) { // user already starred, decrement count 
            await tweetDb.findOneAndUpdate({ tweetId: tweetId }, { $pull: { starredBy: username } }).exec();
            await tweetDb.updateOne({ tweetId: tweetId }, { $inc: { stars: -1 } }).exec();
            starredByMe = '';
        }
        else { // user didnt star this tweet, increment count
            await tweetDb.findOneAndUpdate({ tweetId: tweetId }, { $push: { starredBy: username } }).exec();
            await tweetDb.updateOne({ tweetId: tweetId }, { $inc: { stars: 1 } }).exec();
            starredByMe = username;
        }
        const updated = await tweetDb.findOne({ tweetId: tweetId }).exec();
        const starsNum = (updated as Tweet).stars;
        return res.status(200).send({ starsNum, starredByMe });

    }
    catch (error) {
        next(new Error(error));
    }
}

export function createTweetObject(username: string, element: Tweet): TweetRes {
    return {
        tweetId: element.tweetId,
        username: element.username,
        content: element.content,
        date: element.date,
        stars: element.stars,
        avatarUrl: element.avatarUrl,
        starredByMe: username
    }

}
