import UserService from "./UserService.js";
import { EMAIL_ALREADY_REGISTERED, INVALID_CREDENTIALS } from './constants/errorsMessages.js';
import AccessToken from "./models/AccessToken.js";
import User from "./models/User.js";

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
            const parts = authorization.split(' ');
            const [_, accessToken] = authorization.split(' ');
            if (!accessToken) {
                res.status(403).json({ message: 'Invalid authorization header provided' });
            }
            const tokenData = await AccessToken.findOneAndDelete({ token: accessToken });
            if (!tokenData) {
                res.status(404).json({ message: 'The token is not actual' });
            }
            res.status(200).json({ userId: tokenData.userId });
        } catch (e) {
            res.status(500).json(e);
        }
    }

    // async login(req, res) {
    //     try {
    //         const tokenData = await UserService.login(req.body);
    //         res.status(200).json(tokenData);
    //     } catch (e) {
    //         res.status(500).json(e)
    //     }
    // }

    // async findByEmail(req, res) {
    //     try {
    //         const user = await UserService.findUserByEmail(req.query.email);
    //         res.status(200).json(user);
    //     } catch (e) {
    //         res.status(404).json(e)
    //     }
    // }

}


export default new UserController();
