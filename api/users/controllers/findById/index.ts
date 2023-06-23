import UserService from "../../../../services/UserService";
import { Request } from "express";

import { AuthorizedRequest, GetUserResponse } from '../../../../types';
import ResponseError, { ErrorCode } from "../../../../error";

export const findById = async (req: Request, res: GetUserResponse) => {
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