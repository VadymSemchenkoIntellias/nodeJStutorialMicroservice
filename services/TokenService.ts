import { v4 as uuidV4 } from 'uuid';
import randomString from "randomstring";

import { AccessToken, RefreshToken } from '../models';
import ResponseError, { ErrorCode } from '../error';

class TokenService {
    async deleteToken(accessToken: string) {
        const accessTokenData = await AccessToken.findOneAndDelete({ token: accessToken });
        if (!accessTokenData) {
            throw new ResponseError(ErrorCode.ALREADY_LOGGED_OUT, 'Already logged out');

        }
        await RefreshToken.findOneAndDelete({ userId: accessTokenData.userId });
        return accessTokenData;
    }

    getTokenData(accessToken: string) {
        return AccessToken.findOne({ token: accessToken });
    }

    async refreshToken(prevToken: string) {
        const prevRefreshTokenData = await RefreshToken.findOne({ token: prevToken });
        if (!prevRefreshTokenData) {
            throw new ResponseError(ErrorCode.REFRESH_TOKEN_IS_NOT_VALID, 'Refresh token is not valid');
        }
        if (prevRefreshTokenData.expirationTime < Date.now()) {
            prevRefreshTokenData.deleteOne();
            throw new ResponseError(ErrorCode.TOKEN_EXPIRED, 'Token is expired');
        }
        const updatedAccessToken = `${uuidV4()}${randomString.generate(4)}`;
        const updatedRefreshToken = `${uuidV4()}${randomString.generate(4)}`;
        const updatedAccessTokenExpirationTime = Date.now() + 3600000;
        const updatedRefreshTokenExpirationTime = Date.now() + 4800000;
        const updatedRefreshTokenData = await RefreshToken.findOneAndUpdate({ token: prevToken }, { token: updatedRefreshToken, expirationTime: updatedRefreshTokenExpirationTime }, { new: true });
        if (!updatedRefreshTokenData) {
            throw new ResponseError(ErrorCode.REFRESH_TOKEN_IS_NOT_VALID, 'Refresh token is not valid');
        }
        const updatedAccessTokenData = await RefreshToken.findOneAndUpdate({ userId: updatedRefreshTokenData.userId }, { token: updatedAccessToken, expirationTime: updatedAccessTokenExpirationTime }, { new: true });
        if (!updatedAccessTokenData) {
            throw new ResponseError(ErrorCode.ALREADY_LOGGED_OUT, 'User logged out');
        }
        return {
            accessToken: updatedAccessTokenData.token,
            accessTokenExpirationTime: updatedAccessTokenData.expirationTime,
            refreshToken: updatedRefreshTokenData.token,
            refreshTokenExpirationTime: updatedRefreshTokenData.expirationTime
        };
    }
}


export default new TokenService();