import { v4 as uuidV4 } from 'uuid';
import randomString from "randomstring";

import AccessToken from "./models/AccessToken";
import RefreshToken from "./models/RefreshToken";

class TokenService {
    async deleteToken(accessToken: string) {
        const accessTokenData = await AccessToken.findOneAndDelete({ token: accessToken });
        if (!accessTokenData) {
            throw new Error('Already logged out');

        }
        await RefreshToken.findOneAndDelete({ userId: accessTokenData.userId });
        return accessTokenData;
    }

    getTokenData(accessToken: string) {
        return AccessToken.findOne({ token: accessToken });
    }

    async refreshToken(prevToken: string) {
        const updatedAccessToken = `${uuidV4()}${randomString.generate(4)}`;
        const updatedRefreshToken = `${uuidV4()}${randomString.generate(4)}`;
        const updatedAccessTokenExpirationTime = Date.now() + 3600000;
        const updatedRefreshTokenExpirationTime = Date.now() + 4800000;
        const updatedRefreshTokenData = await RefreshToken.findOneAndUpdate({ token: prevToken }, { token: updatedRefreshToken, expirationTime: updatedRefreshTokenExpirationTime }, { new: true });
        if (!updatedRefreshTokenData) {
            throw new Error('Refresh token is not valid');
        }
        const updatedAccessTokenData = await RefreshToken.findOneAndUpdate({ userId: updatedRefreshTokenData.userId }, { token: updatedAccessToken, expirationTime: updatedAccessTokenExpirationTime }, { new: true });
        if (!updatedAccessTokenData) {
            throw new Error('User not logged out');
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