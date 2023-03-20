import AccessToken from "./models/AccessToken.js";

class TokenService {
    deleteToken(token) {
        return AccessToken.findOneAndDelete({ token });
    }

    getTokenData(token) {
        return AccessToken.findOne({ token });
    }
}


export default new TokenService();