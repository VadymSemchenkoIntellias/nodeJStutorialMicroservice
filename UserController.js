import UserService from "./UserService.js";
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
