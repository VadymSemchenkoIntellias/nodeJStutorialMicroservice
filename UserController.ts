import UserService from "./UserService";
import TokenService from "./TokenService";
import { EMAIL_ALREADY_REGISTERED, INVALID_CREDENTIALS, ALREADY_LOGGED_IN } from './constants/errorsMessages';

import { CreateOrLoginUserRequest, CreateOrLoginUserResponse, LogoutUserResponse, ErrorMessage, AuthorizedRequest, GetUserResponse, RefreshTokenRequest, RefreshTokenResponse } from './types'
import { Request } from "express";


class UserController {
    async create(req: CreateOrLoginUserRequest, res: CreateOrLoginUserResponse) {
        try {
            const user = await UserService.register(req.body);
            res.status(201).json(user);
        } catch ({ message }: any) {
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
            res.status(errorCode).json({ message } as ErrorMessage);
        }
    }

    async logout(req: Request, res: LogoutUserResponse) {
        try {
            const { authorization } = req.headers;
            if (!authorization) {
                res.status(403).json({ message: 'No authorization header provided' } as ErrorMessage);
                return;
            }
            authorization.split(' ');
            const [_, accessToken] = authorization.split(' ');
            if (!accessToken) {
                res.status(403).json({ message: 'Invalid authorization header provided' } as ErrorMessage);
                return;
            }
            const tokenData = await TokenService.deleteToken(accessToken);
            if (!tokenData) {
                res.status(404).json({ message: 'The token is not actual' } as ErrorMessage);
                return;
            }
            res.status(200).json({ userId: tokenData.userId });
        } catch (e) {
            res.status(500).json(e as Error);
        }
    }

    async login(req: CreateOrLoginUserRequest, res: CreateOrLoginUserResponse) {
        try {
            const user = await UserService.login(req.body);
            res.status(200).json(user);
        } catch ({ message }: any) {
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
            res.status(errorCode).json({ message } as ErrorMessage);
        }
    }

    async getUserData(req: Request, res: GetUserResponse) {
        try {
            const { userId } = (req as AuthorizedRequest).tokenData;
            const userData = await UserService.getUserById(userId);
            if (!userData) {
                res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(userData);
        } catch (e) {
            res.status(404).json(e as Error);
        }
    }

    async refreshToken(req: RefreshTokenRequest, res: RefreshTokenResponse) {
        try {
            const { refreshToken } = req.body;
            const tokenData = await TokenService.refreshToken(refreshToken);
            res.status(200).json(tokenData);
        } catch (e) {
            res.status(401).json(e as Error);
        }
    }

}


export default new UserController();
