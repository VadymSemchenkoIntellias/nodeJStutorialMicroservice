import User from "./User.js";
import { createUser } from './firebase.js';

class UserService {
    async register({ email: incomingEmail, password }) {
        const { user: { email, uid: firebaseUid, stsTokenManager: { refreshToken, accessToken, expirationTime } } } = await createUser({ email: incomingEmail, password });
        console.log('FIREBASE USER DATA', {
            email, firebaseUid, refreshToken, accessToken, expirationTime
        });
    }
}


export default new UserService();
