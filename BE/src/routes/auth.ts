import { Router } from 'express';
import {
  authorization,
  logout,
  refreshToken,
  registerUser,
} from '../controllers/auth.js';

const authRouter = Router();
authRouter.post('/', authorization);
authRouter.get('/refresh', refreshToken);
authRouter.post('/user/register', registerUser);
authRouter.get('/user/logout', logout);

export default authRouter;
