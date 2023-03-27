import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

import User from "./models/User.js";
import { EMAIL_ALREADY_REGISTERED, INVALID_CREDENTIALS, ALREADY_LOGGED_IN } from './constants/errorsMessages.js';
import { validateEmail, validatePassword } from './validation.js';
import { JWT_EXPIRATION_TIME, JWT_KEY } from './constants.js'

class UserService {

    async register({ email: incomingEmail, password }) {
        const invalidCredentailReasons = [!incomingEmail, !password, !validateEmail(incomingEmail), !validatePassword(password)];
        const invalidCredentailReasonIndex = invalidCredentailReasons.findIndex(reason => reason);
        if (invalidCredentailReasonIndex !== -1) {
            throw new Error(INVALID_CREDENTIALS);
        }
        const existingUser = await User.findOne({ email: incomingEmail }).lean();
        if (existingUser) {
            throw new Error(EMAIL_ALREADY_REGISTERED);
        }
        const passwordHash = await bcrypt.hash(password, 5);
        const { email, _id: id } = await User.create({ email: incomingEmail, passwordHash });
        const jwtToken = jwt.sign({
            email, id
        }, JWT_KEY, { expiresIn: JWT_EXPIRATION_TIME });
        return {
            jwtToken, email, id
        };
    }

    async login({ email, password }) {
        const userData = await User.findOne({ email }).lean();
        if (!userData) { throw new Error(INVALID_CREDENTIALS) };
        const isPasswordValid = await bcrypt.compare(password, userData.passwordHash);
        if (!isPasswordValid) { throw new Error(INVALID_CREDENTIALS) };
        const jwtToken = jwt.sign({
            email, id: userData._id
        }, JWT_KEY, { expiresIn: JWT_EXPIRATION_TIME });
        return {
            jwtToken, email, id: userData._id
        }
    }

    async getUserById(userId) {
        const userData = await User.findById(userId).lean();
        const { _id, email } = userData;
        return { id: _id, email };
    }

}


export default new UserService();