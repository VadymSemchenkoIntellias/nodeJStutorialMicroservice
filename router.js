import Router from 'express';
import UserController from './UserController.js';
import { validateAuth } from './middlewares/validateAuth.js';

const router = new Router();

router.post('/register', UserController.create);
router.post('/logout', UserController.logout);
router.post('/login', UserController.login);
router.get('/getUserData', validateAuth, UserController.getUserData);
router.post('/refresh', validateAuth, UserController.refreshToken);

export default router;
