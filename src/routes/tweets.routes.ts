import { Router } from 'express';
import * as TweetsController from '../controllers/tweets.controller';
import { authenticate } from '../middlewares/auth';
import { validateTweetContent, validateTweetId } from '../middlewares/validations';

export const tweetsRouter = Router();

tweetsRouter.post('/', authenticate, validateTweetContent, TweetsController.postTweet);

tweetsRouter.get('/', TweetsController.getTweets);

tweetsRouter.delete('/:id', authenticate, validateTweetId, TweetsController.deleteTweet);

tweetsRouter.post('/:id/star-toggle', authenticate, validateTweetId, TweetsController.starToggle);



