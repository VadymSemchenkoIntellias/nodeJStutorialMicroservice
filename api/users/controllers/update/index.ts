import { ExternalService, UserService } from "../../../../services";
import { UpdateUserResponse, TokenData } from '../../../../types';
import ResponseError, { ErrorCode } from "../../../../error";
import { Request } from 'express';

export const update = async (req: Request, res: UpdateUserResponse) => {
    const { tokenData: { userId }, body: { name, email } } = req as Request & TokenData;
    try {
        const user = await UserService.update({ name, email, id: userId });
        await ExternalService.updateProductOwner({ name, email, id: userId });
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