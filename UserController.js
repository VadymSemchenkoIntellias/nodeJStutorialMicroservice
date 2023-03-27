import UserService from "./UserService.js";
import { EMAIL_ALREADY_REGISTERED, INVALID_CREDENTIALS, ALREADY_LOGGED_IN } from './constants/errorsMessages.js';

class UserController {
    async create(req, res) {
        try {
            const user = await UserService.register(req.body);
            res.status(201).json(user);
        } catch ({ message }) {
            let errorCode;
            switch (message) {
                case EMAIL_ALREADY_REGISTERED:
                    errorCode = 409;
                    break;
                case INVALID_CREDENTIALS:
                    errorCode = 400;
                    break;
                case ALREADY_LOGGED_IN:
                    errorCode = 208;
                    break;
                default:
                    errorCode = 500;
                    break;
            }
            res.status(errorCode).json({ message });
        }
    }


    async login(req, res) {
        try {
            const user = await UserService.login(req.body);
            res.status(200).json(user);
        } catch ({ message }) {
            let errorCode;
            switch (message) {
                case EMAIL_ALREADY_REGISTERED:
                    errorCode = 409;
                    break;
                case INVALID_CREDENTIALS:
                    errorCode = 400;
                    break;
                default:
                    errorCode = 500;
                    break;
            }
            res.status(errorCode).json({ message });
        }
    }

    async getUserData(req, res) {
        try {
            const { userId } = req.tokenData;
            const userData = await UserService.getUserById(userId);
            if (!userData) {
                res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(userData);
        } catch (e) {
            res.status(404).json(e)
        }
    }

    async refreshToken(req, res) {
        try {
            const { refreshToken } = req.body;
            res.status(200).json({});
        } catch (e) {
            console.log('ERROR AT REFRESH TOKEN', e);
            res.status(401).json(e);
        }
    }

}


export default new UserController();
