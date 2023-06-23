import { TokenService } from "../../../../services";
import { LogoutUserResponse } from '../../../../types';
import ResponseError, { ErrorCode } from "../../../../error";
import { Request } from 'express';

export const logout = async (req: Request, res: LogoutUserResponse) => {
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