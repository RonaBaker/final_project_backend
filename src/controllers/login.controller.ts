import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user';
import { userDb } from '../store/users'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export async function login(req: Request, res: Response, next: NextFunction) {
    const email = req.body.email;
    const password = req.body.password;
    let fetchedUser: User;
    userDb.findOne({ email: email }).exec()
        .then(user => {
            if (!user) { // No user found
                return res.sendStatus(400);
            }
            fetchedUser = user;
            // User found, check encrypted password
            bcrypt.compare(password, user.password).then(result => {
                if (!result) {
                    return res.sendStatus(400);
                }
                // Valid password, create access-token
                const token = jwt.sign({ email: fetchedUser.email, username: fetchedUser.username }, 'MY_SECRET_JWT')
                // Update login date and time
                userDb.updateOne({ username: fetchedUser.username }, { lastLogin: new Date().toLocaleString() }).exec();
                res.status(200).send({ token: token, username: fetchedUser.username })
            })
        })
        .catch(error => {
            next(error);
        })

}