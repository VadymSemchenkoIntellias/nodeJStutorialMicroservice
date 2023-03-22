import UserService from "./UserService.js";
import TokenService from "./TokenService.js";
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

    async logout(req, res) {
        try {
            const { authorization } = req.headers;
            if (!authorization) {
                res.status(403).json({ message: 'No authorization header provided' });
                return;
            }
            authorization.split(' ');
            const [_, accessToken] = authorization.split(' ');
            if (!accessToken) {
                res.status(403).json({ message: 'Invalid authorization header provided' });
                return;
            }
            const tokenData = await TokenService.deleteToken(accessToken);
            if (!tokenData) {
                res.status(404).json({ message: 'The token is not actual' });
                return;
            }
            res.status(200).json({ userId: tokenData.userId });
        } catch (e) {
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
        } catch (e) {

        }
    }

}


export default new UserController();
