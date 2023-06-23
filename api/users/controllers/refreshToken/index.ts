import { TokenService } from "../../../../services";

import { RefreshTokenRequest, RefreshTokenResponse } from '../../../../types';

export const refreshToken = async (req: RefreshTokenRequest, res: RefreshTokenResponse) => {
    try {
        const { refreshToken } = req.body;
        const tokenData = await TokenService.refreshToken(refreshToken);
        res.status(200).json(tokenData);
    } catch (e) {
        res.status(401).json(e as Error);
    }
}