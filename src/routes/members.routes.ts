import { Router } from 'express';
import { getMemberById, getTweetsById } from '../controllers/members.controller'
import { validateUserId } from '../middlewares/validations';

export const membersRouter = Router();

membersRouter.get('/:id',  validateUserId , getMemberById);

membersRouter.get('/:id/tweets',  validateUserId , getTweetsById);




