import bcrypt from "bcryptjs";
import { v4 as uuidV4 } from 'uuid';
import randomString from "randomstring";

import User from "./models/User";
import AccessToken from "./models/AccessToken";
import RefreshToken from "./models/RefreshToken";
import { EMAIL_ALREADY_REGISTERED, INVALID_CREDENTIALS, ALREADY_LOGGED_IN } from './constants/errorsMessages';
import { validateEmail, validatePassword } from './validation';

import { CreateOrLoginUserData } from './types';

class UserService {

    async _createAccessToken(userId: string) {
        const accessToken = `${uuidV4()}${randomString.generate(4)}`;
        const refreshToken = `${uuidV4()}${randomString.generate(4)}`;
        const accessTokenExpirationTime = Date.now() + 3600000;
        const refreshTokenExpirationTime = Date.now() + 4800000;
        await AccessToken.create({
            token: accessToken,
            expirationTime: accessTokenExpirationTime,
            userId
        });
        await RefreshToken.create({
            token: refreshToken,
            expirationTime: refreshTokenExpirationTime,
            userId
        });
        return { accessToken, accessTokenExpirationTime, refreshToken, refreshTokenExpirationTime }
    }

    async register({ email, password }: CreateOrLoginUserData) {
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
        const { accessToken, accessTokenExpirationTime, refreshToken, refreshTokenExpirationTime } = await this._createAccessToken(userData.id);
        return { email: userData.email, id: userData.id, accessToken, accessTokenExpirationTime, refreshToken, refreshTokenExpirationTime };
    }

    async login({ email, password }: CreateOrLoginUserData) {
        const userData = await User.findOne({ email }).lean();
        if (!userData) { throw new Error(INVALID_CREDENTIALS) }
        const isPasswordValid = await bcrypt.compare(password, userData.passwordHash);
        if (!isPasswordValid) { throw new Error(INVALID_CREDENTIALS) }
        const existingAccessToken = await AccessToken.findOne({ userid: userData._id }).lean();
        if (existingAccessToken) { throw new Error(ALREADY_LOGGED_IN) }
        const { accessToken, accessTokenExpirationTime, refreshToken, refreshTokenExpirationTime } = await this._createAccessToken(userData._id.toString());
        return { email: userData.email, id: userData._id.toString(), accessToken, accessTokenExpirationTime, refreshToken, refreshTokenExpirationTime };
    }

    async getUserById(userId: string) {
        const userData = await User.findById(userId).lean();
        const { _id, email } = userData;
        return { id: _id.toString(), email };
    }

}


export default new UserService();