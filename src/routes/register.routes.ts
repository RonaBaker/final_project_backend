import { Router } from 'express';
import { register, storage } from '../controllers/register.controller'
import { validateRegisterReq } from '../middlewares/validations';
import multer = require('multer');

export const registerRouter = Router();

registerRouter.post('/register', multer({storage: storage}).single('avatarUrl') ,validateRegisterReq, register);
