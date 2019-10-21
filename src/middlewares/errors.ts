import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
      console.log(err.message);
      res.status(400).send(err.message);
}
