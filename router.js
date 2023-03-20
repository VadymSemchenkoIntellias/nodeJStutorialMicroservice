import Router from 'express';
import UserController from './UserController.js';

const router = new Router();

router.post('/register', UserController.create);
router.post('/logout', UserController.logout);
// router.post('/login', UserController.login);
// router.get('/findByEmail', UserController.findByEmail);

export default router;
