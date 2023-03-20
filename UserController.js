import UserService from "./UserService.js";
import TokenService from "./TokenService.js";
import { EMAIL_ALREADY_REGISTERED, INVALID_CREDENTIALS } from './constants/errorsMessages.js';

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
                default:
                    errorCode = 500;
                    break;
            }
            res.status(errorCode).json({ message });
        }
    }

    async logout(req, res) {
        try {
            const { authorization } = req.headers;
            if (!authorization) {
                res.status(403).json({ message: 'No authorization header provided' });
            }
            authorization.split(' ');
            const [_, accessToken] = authorization.split(' ');
            if (!accessToken) {
                res.status(403).json({ message: 'Invalid authorization header provided' });
            }
            const tokenData = await TokenService.deleteToken(accessToken);
            if (!tokenData) {
                res.status(404).json({ message: 'The token is not actual' });
            }
            res.status(200).json({ userId: tokenData.userId });
        } catch (e) {
            console.log('ERROR', e);
            res.status(500).json(e);
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
            console.log('TOKEN DATA', req.tokenData);
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

}


export default new UserController();
