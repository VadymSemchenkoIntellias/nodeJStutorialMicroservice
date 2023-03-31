import UserService from "./UserService";
import TokenService from "./TokenService";

import { CreateOrLoginUserRequest, CreateOrLoginUserResponse, LogoutUserResponse, ErrorMessage, AuthorizedRequest, GetUserResponse, RefreshTokenRequest, RefreshTokenResponse } from './types';
import { Request } from "express";
import ResponseError, { ErrorCode } from "./error";

class UserController {
    async create(req: CreateOrLoginUserRequest, res: CreateOrLoginUserResponse) {
        try {
            const user = await UserService.register(req.body);
            res.status(201).json(user);
        } catch (error: unknown) {
            let status;
            switch ((error as ResponseError).code) {
                case ErrorCode.EMAIL_ALREADY_REGISTERED:
                    status = 409;
                    break;
                case ErrorCode.INVALID_CREDENTIALS:
                    status = 400;
                    break;
                case ErrorCode.ALREADY_LOGGED_IN:
                    status = 208;
                    break;
                default:
                    status = 500;
                    break;
            }
            res.status(status).json({ code: (error as ResponseError).code });
        }
    }

    async logout(req: Request, res: LogoutUserResponse) {
        try {
            const { authorization } = req.headers;
            if (!authorization) {
                res.status(403).json({ code: ErrorCode.NO_AUTH_HEADER_PROVIDED });
                return;
            }
            authorization.split(' ');
            const [_, accessToken] = authorization.split(' ');
            if (!accessToken) {
                res.status(403).json({ code: ErrorCode.INVALID_AUTH_HEADER_PROVIDED });
                return;
            }
            const tokenData = await TokenService.deleteToken(accessToken);
            if (!tokenData) {
                res.status(404).json({ code: ErrorCode.TOKEN_IS_NOT_ACTUAL });
                return;
            }
            res.status(200).json({ userId: tokenData.userId });
        } catch (error) {
            res.status(500).json({ code: ErrorCode.UNHANDLED_SERVER_ERROR, error: error as ResponseError });
        }
    }

    async login(req: CreateOrLoginUserRequest, res: CreateOrLoginUserResponse) {
        try {
            const user = await UserService.login(req.body);
            res.status(200).json(user);
        } catch (error: unknown) {
            let status;
            switch ((error as ResponseError).code) {
                case ErrorCode.EMAIL_ALREADY_REGISTERED:
                    status = 409;
                    break;
                case ErrorCode.INVALID_CREDENTIALS:
                    status = 400;
                    break;
                default:
                    status = 500;
                    break;
            }
            res.status(status).json({ code: (error as ResponseError).code, error: error as ResponseError });
        }
    }

    async getUserData(req: Request, res: GetUserResponse) {
        try {
            const { userId } = (req as AuthorizedRequest).tokenData;
            const userData = await UserService.getUserById(userId);
            if (!userData) {
                res.status(404).json({ code: ErrorCode.USER_NOT_FOUND });
            }
            res.status(200).json(userData);
        } catch (e) {
            res.status(404).json(e as ResponseError);
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
