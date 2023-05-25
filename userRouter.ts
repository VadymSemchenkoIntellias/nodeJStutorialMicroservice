import { Router } from 'express';
import UserController from './UserController';
import { validateAuth, validateBasicAuth } from './middlewares/validateAuth';

const router = Router();

router.post('/register', UserController.create);
router.post('/logout', UserController.logout);
router.post('/login', UserController.login);
router.get('/getUserData', validateAuth, UserController.getUserData);
router.post('/update', validateAuth, UserController.updateUser);
router.get('/getUserDataById/:id', validateBasicAuth, UserController.getUserDataById);
router.post('/refresh', validateAuth, UserController.refreshToken);

export { router };
