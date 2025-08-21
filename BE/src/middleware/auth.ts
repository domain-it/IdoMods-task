import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

export const authVerify = (req: Request, res: Response, next: NextFunction) => {
  const authTokenSecret = process.env.ACCESS_TOKEN_SECRET || '';
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
  const token = authHeader.split(' ')[1] || '';
  jwt.verify(token, authTokenSecret, (error) => {
    if (error) return res.status(401).json({ error: 'Unauthorized' });
    next();
  });
};
