import { Router } from 'express';
import { validateAuth, validateBasicAuth } from './validation/validateAuth';
import * as UserController from './controllers';

const router = Router();

router.post('/register', UserController.create);
router.post('/logout', UserController.logout);
router.post('/login', UserController.login);
router.get('/getUserData', validateAuth, UserController.getCurrent);
router.post('/update', validateAuth, UserController.update);
router.get('/getUserDataById/:id', validateBasicAuth, UserController.findById);
router.post('/refresh', validateAuth, UserController.refreshToken);

export { router };
