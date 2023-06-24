import UserService from "../../../../services/UserService";

import { CreateUserRequest, CreateOrLoginUserResponse } from '../../../../types';
import ResponseError, { ErrorCode } from "../../../../error";

export const create = async (req: CreateUserRequest, res: CreateOrLoginUserResponse) => {
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