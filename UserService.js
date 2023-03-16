import User from "./User.js";
import { createUser, loginUser } from './firebase.js';

class UserService {
    async register({ email: incomingEmail, password }) {
        const { user: { email, uid: firebaseUid, stsTokenManager: { refreshToken, accessToken, expirationTime } } } = await createUser({ email: incomingEmail, password });
        const dbResult = await User.create({ email, firebaseUid });
        return {
            email, firebaseUid, refreshToken, accessToken, expirationTime, id: dbResult._id.valueOf()
        };
    }

    async login({ email, password }) {
        const response = await loginUser({ email, password });
        const { user: { stsTokenManager: { refreshToken, accessToken, expirationTime } }, _tokenResponse: { idToken } } = response;
        return { refreshToken, accessToken, idToken, expirationTime };
    }

    async findUserByEmail(email) {
        const { _id, firebaseUid } = await User.findOne({ email });
        return { id: _id.valueOf(), firebaseUid };
    }
}


export default new UserService();