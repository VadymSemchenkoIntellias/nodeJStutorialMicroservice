import Router from 'express';
import UserController from './UserController.js';

const router = new Router();

router.post('/register', UserController.create);
router.post('/login', UserController.login);

export default router;
