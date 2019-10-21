import { Request, Response, NextFunction } from 'express';
import { userDb } from '../store/users';
import { tweetDb } from '../store/tweets';
import { UserProfile } from '../models/user';
import { User } from '../models/user';
import jwt from 'jsonwebtoken';
import { ReversedToken } from '../middlewares/auth';
import { TweetRes } from '../models/tweet';
import { createTweetObject } from '../controllers/tweets.controller';


export async function getMemberById(req: Request, res: Response, next: NextFunction) {
    const username = req.params.id;
    try {
        const user = await userDb.findOne({ username: username }).exec()
        if (!user) {
            return res.sendStatus(404);
        }
        const userProfile = createProfile(user);
        res.status(200).send(userProfile);
    }
    catch (error) {
        next(new Error(error));
    }
}

export async function getTweetsById(req: Request, res: Response, next: NextFunction) {
    const username = req.params.id;
    try {
        const user = await userDb.findOne({ username: username }).exec(); // if no such user in db
        if (!user) {
            return res.sendStatus(404);
        }
        const token = (req.headers.authorization as string).split(" ")[1];
        if (token !== 'undefined') { // check if access token is provided, then verify token
            try {
                const reversedToken = jwt.verify(token, 'MY_SECRET_JWT');
                const usernametoken = (reversedToken as ReversedToken).username;
                await tweetDb.find({ username: username }).exec().then(tweetsRes => {
                    let tweets: TweetRes[] = [];
                    for (let element of tweetsRes) {
                        if (element.starredBy.find(username => username === usernametoken) !== undefined) {
                            tweets.push(createTweetObject(usernametoken, element));
                        }
                        else {
                            tweets.push(createTweetObject('', element));
                        }
                    }
                    return res.status(200).send(tweets);
                })
            }
            catch { // if token isn't verified return user tweets anyway
                const userTweets = await tweetDb.find({ username: username }).exec();
                return res.status(200).send(userTweets);
            }
        } else {
            const userTweets = await tweetDb.find({ username: username }).exec();
            return res.status(200).send(userTweets);
        }

    }
    catch (error) {
        next(new Error(error));
    }
}


function createProfile(user: User): UserProfile {
    return {
        email: user.email,
        username: user.username,
        registrationDate: user.registrationDate,
        lastLogin: user.lastLogin,
        avatarUrl: user.avatarUrl
    };
}
