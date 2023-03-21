import bcrypt from "bcryptjs";
import { v4 as uuidV4 } from 'uuid';
import randomString from "randomstring";

import User from "./models/User.js";
import AccessToken from "./models/AccessToken.js";
import { EMAIL_ALREADY_REGISTERED, INVALID_CREDENTIALS, ALREADY_LOGGED_IN } from './constants/errorsMessages.js';
import { validateEmail, validatePassword } from './validation.js';

class UserService {

    async _createAccessToken(userId) {
        const accessToken = `${uuidV4()}${randomString.generate(4)}`;
        const expirationTime = Date.now() + 3600000;
        await AccessToken.create({
            token: accessToken,
            expirationTime,
            userId
        });
        return { accessToken, expirationTime }
    }

    async register({ email, password }) {
        const invalidCredentailReasons = [!email, !password, !validateEmail(email), !validatePassword(password)];
        const invalidCredentailReasonIndex = invalidCredentailReasons.findIndex(reason => reason);
        if (invalidCredentailReasonIndex !== -1) {
            throw new Error(INVALID_CREDENTIALS);
        }
        const existingUser = await User.findOne({ email }).lean();
        if (existingUser) {
            throw new Error(EMAIL_ALREADY_REGISTERED);
        }
        const passwordHash = await bcrypt.hash(password, 5);
        const userData = await User.create({ email, passwordHash });
        const { accessToken, expirationTime } = await this._createAccessToken(userData._id);
        return { email: userData.email, id: userData._id, accessToken, expiresAt: expirationTime };
    }

    async login({ email, password }) {
        const userData = await User.findOne({ email }).lean();
        if (!userData) { throw new Error(INVALID_CREDENTIALS) };
        const isPasswordValid = await bcrypt.compare(password, userData.passwordHash);
        if (!isPasswordValid) { throw new Error(INVALID_CREDENTIALS) };
        const existingToken = await AccessToken.findOne({ userid: userData._id }).lean();
        if (existingToken) { throw new Error(ALREADY_LOGGED_IN) };
        const { accessToken, expirationTime } = await this._createAccessToken(userData._id);
        return { email: userData.email, id: userData._id, accessToken, expiresAt: expirationTime };
    }

    async getUserById(userId) {
        const userData = await User.findById(userId).lean();
        const { _id, email } = userData;
        return { id: _id, email };
    }

}


export default new UserService();