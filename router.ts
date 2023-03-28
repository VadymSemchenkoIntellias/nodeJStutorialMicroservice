import { Router } from 'express';
import UserController from './UserController';
import { validateAuth } from './middlewares/validateAuth';

const router = Router();

router.post('/register', UserController.create);
router.post('/logout', UserController.logout);
router.post('/login', UserController.login);
router.get('/getUserData', validateAuth, UserController.getUserData);
router.post('/refresh', validateAuth, UserController.refreshToken);

export { router };
