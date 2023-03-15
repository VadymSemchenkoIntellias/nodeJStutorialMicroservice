import Router from 'express';
import UserController from './UserController.js';

const router = new Router();

router.post('/register', UserController.create);

export default router;
