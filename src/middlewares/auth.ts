import { Request, NextFunction, Response} from 'express';
import jwt from 'jsonwebtoken';

export interface ReversedToken {
    email: string,
    username: string,
    key: number
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
    try {
        // Get token
        const token = (req.headers.authorization as string).split(" ")[1];
        // Verify token
        const reversedToken = jwt.verify(token, 'MY_SECRET_JWT');
        res.locals = (reversedToken as ReversedToken).username;
        next();
    }
    catch( error ) {
        res.status(401).send(error);
    }
}