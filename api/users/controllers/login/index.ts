import UserService from "../../../../services/UserService";
import { LoginUserRequest, CreateOrLoginUserResponse } from '../../../../types';
import ResponseError, { ErrorCode } from "../../../../error";

export const login = async (req: LoginUserRequest, res: CreateOrLoginUserResponse) => {
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