import bcrypt from "bcryptjs";

import User from "./User.js";
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
        const result = await User.create({ email, passwordHash });
        return { email: result.email, id: result._id };
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