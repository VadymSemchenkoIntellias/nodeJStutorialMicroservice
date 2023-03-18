import bcrypt from "bcryptjs";
import { v4 as uuidV4 } from 'uuid';
import randomString from "randomstring";

import User from "./models/User.js";
import AccessToken from "./models/AccessToken.js";
import { EMAIL_ALREADY_REGISTERED, INVALID_CREDENTIALS } from './constants/errorsMessages.js';
import { validateEmail, validatePassword } from './validation.js';

class UserService {
    async register({ email, password }) {
        if (!email || !password || !validateEmail(email) || !validatePassword(password)) {
            throw new Error(INVALID_CREDENTIALS);
        }
        const existingUser = await User.findOne({ email }).lean();
        if (existingUser) {
            throw new Error(EMAIL_ALREADY_REGISTERED);
        }
        const passwordHash = await bcrypt.hash(password, 5);
        const userData = await User.create({ email, passwordHash });
        const accessToken = `${uuidV4()}${randomString.generate(4)}`;
        const expirationTime = Date.now() + 3600000;
        const accessTokenData = await AccessToken.create({
            token: accessToken,
            expirationTime,
            userId: userData._id
        });
        return { email: userData.email, id: userData._id, accessToken, expiresAt: expirationTime };
    }

    // async login({ email, password }) {
    //     const response = await loginUser({ email, password });
    //     const { user: { stsTokenManager: { refreshToken, accessToken, expirationTime } }, _tokenResponse: { idToken } } = response;
    //     return { refreshToken, accessToken, idToken, expirationTime };
    // }

    // async findUserByEmail(email) {
    //     return User.findOne({ email }).lean();
    // }
}


export default new UserService();