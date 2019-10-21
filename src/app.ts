import express from 'express';
import cors from 'cors';
import { tweetsRouter } from './routes/tweets.routes'
import { loginRouter } from './routes/login.routes'
import { registerRouter } from './routes/register.routes'
import { membersRouter } from './routes/members.routes';
import { errorHandler } from './middlewares/errors';
import path from 'path';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/api/auth', registerRouter)
app.use('/api/auth', loginRouter);
app.use('/api/tweets', tweetsRouter);
app.use('/api/members', membersRouter);

app.use(errorHandler);

export default app;
