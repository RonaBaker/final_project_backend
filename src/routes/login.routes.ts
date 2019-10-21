import { Router } from 'express';
import { login } from '../controllers/login.controller';

export const loginRouter = Router();

loginRouter.post('/login', login);
