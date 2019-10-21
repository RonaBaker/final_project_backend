
import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user';
import { userDb } from '../store/users'
import bcrypt from 'bcrypt';
import multer from 'multer';
import path from 'path';
import fs from 'fs';


export const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const isValid = file.mimetype;
        let error = null
        if (isValid !== "image/png" && isValid !== 'image/jpeg' && isValid !== 'image/jpg') {
            error = new Error("Invalid mime type");
        }
        callback(error, path.join(__dirname, '../public'));
    },
    filename: (req: Request, file, callback) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const uniqueName = req.body.username + Date.now();
        callback(null, uniqueName + name);
    }
})


export async function register(req: Request, res: Response, next: NextFunction) {

    try {
        const uniqeUsername = await userDb.find({ username: req.body.username }).exec();
        if (uniqeUsername.length > 0) {
            deleteTempFile(req);
            return res.status(409).send('Username is already registered');
        }
        const uniqeUserEmail = await userDb.find({ email: req.body.email }).exec();
        if (uniqeUserEmail.length > 0) {
            deleteTempFile(req);
            return res.status(409).send('Email is already registered');
        }
        bcrypt.hash(req.body.password, 10)
            .then(hash => {
                let url = req.protocol + '://' + req.get('host');
                if (req.file) {
                    url += '/public/' + req.file.filename;
                } else {
                    url += '/public/defaultprofile.png';
                }
                const user: User = {
                    email: req.body.email,
                    username: req.body.username,
                    password: hash,
                    registrationDate: new Date().toLocaleDateString(),
                    lastLogin: new Date().toLocaleString(),
                    avatarUrl: url
                }
                userDb.create(user).then(dbUser => {
                    return res.status(201).send(dbUser);
                })
            }).catch(error => {
                deleteTempFile(req);
                next(error);
            }
            );
    }
    catch (error) {
        next(error);
    }
}

export function deleteTempFile(req: Request) { // delete uploaded file in case of validation error or user conflict
    try {
        if (req.file) {
            const myPath = '../public/' + req.file.filename;
            fs.unlinkSync(path.join(__dirname, myPath));
        }
    } catch (err) {
        console.log(err, 'Could not delete temporary file');
    }
}