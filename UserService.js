import User from "./User.js";
import { createUser } from './firebase.js';

class UserService {
    async register({ email: incomingEmail, password }) {
        const { user: { email, uid: firebaseUid, stsTokenManager: { refreshToken, accessToken, expirationTime } } } = await createUser({ email: incomingEmail, password });
        const dbResult = await User.create({ email, firebaseUid });
        return {
            email, firebaseUid, refreshToken, accessToken, expirationTime, id: dbResult._id.valueOf()
        };
    }
}


export default new UserService();