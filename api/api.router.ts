import { Router } from 'express';
import { router as UserRouter } from './users/user.router';

const router = Router();

router.use('/users', UserRouter);

export { router };
