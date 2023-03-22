import AccessToken from "./models/AccessToken.js";
import RefreshToken from "./models/RefreshToken.js";

class TokenService {
    async deleteToken({ accessToken, refreshToken }) {
        const accessTokenData = await AccessToken.findOneAndDelete({ token: accessToken });
        await RefreshToken.findOneAndDelete({ token: refreshToken });
        return accessTokenData;
    }

    getTokenData(accessToken) {
        return AccessToken.findOne({ token: accessToken });
    }
}


export default new TokenService();