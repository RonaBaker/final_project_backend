import { Request, Response, NextFunction } from 'express';
import joi from 'joi';
import { userSchema, tweetSchema } from '../validations/validation-schema';
import { deleteTempFile } from '../controllers/register.controller';

export function validateRegisterReq(req: Request, res: Response, next: NextFunction) {
    const { error } = joi.validate({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    }, userSchema);
    if (error) {
        deleteTempFile(req);
        next(new Error(error.message))
    }
    next();
}

export function validateUserId(req: Request, res: Response, next: NextFunction) {
    const { error } = joi.validate({
        username: req.params.id
    }, userSchema);
    if (error) {
        next(new Error(error.message));
    }
    next();
}

export function validateTweetId(req: Request, res: Response, next: NextFunction) {
    const { error } = joi.validate({
        id: req.params.id
    }, tweetSchema);
    if (error) {
        next(new Error(error.message));
    }
    next();
}

export function validateTweetContent(req: Request, res: Response, next: NextFunction) {
    const { error } = joi.validate({
        content: req.body.tweetContent
    }, tweetSchema);
    if (error) {
        next(new Error("Tweet Content must be 1-240 characters"));
    }
    next();
}

