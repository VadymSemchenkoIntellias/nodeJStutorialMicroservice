import { v4 as uuidV4 } from 'uuid';
import randomString from "randomstring";

import AccessToken from "./models/AccessToken.js";
import RefreshToken from "./models/RefreshToken.js";

class TokenService {
    async deleteToken(accessToken) {
        const accessTokenData = await AccessToken.findOneAndDelete({ token: accessToken });
        await RefreshToken.findOneAndDelete({ userId: accessTokenData.userId });
        return accessTokenData;
    }

    getTokenData(accessToken) {
        return AccessToken.findOne({ token: accessToken });
    }

    async refreshToken(prevToken) {
        const updatedAccessToken = `${uuidV4()}${randomString.generate(4)}`;
        const updatedRefreshToken = `${uuidV4()}${randomString.generate(4)}`;
        const updatedAccessTokenExpirationTime = Date.now() + 3600000;
        const updatedRefreshTokenExpirationTime = Date.now() + 4800000;
        const updatedRefreshTokenData = await RefreshToken.findOneAndUpdate({ token: prevToken }, { token: updatedRefreshToken, expirationTime: updatedRefreshTokenExpirationTime }, { new: true });
        const updatedAccessTokenData = await RefreshToken.findOneAndUpdate({ userId: updatedRefreshTokenData.userId }, { token: updatedAccessToken, expirationTime: updatedAccessTokenExpirationTime }, { new: true });
        return {
            accessToken: updatedAccessTokenData.token,
            accessTokenExpirationTime: updatedAccessTokenData.expirationTime,
            refreshToken: updatedRefreshTokenData.token,
            updatedRefreshTokenExpirationTime: updatedRefreshTokenData.expirationTime
        };
    }
}


export default new TokenService();