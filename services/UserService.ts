import bcrypt from "bcryptjs";
import { v4 as uuidV4 } from 'uuid';
import randomString from "randomstring";

import User from "../models/User";
import AccessToken from "../models/AccessToken";
import RefreshToken from "../models/RefreshToken";
import { validateEmail, validatePassword } from '../validation';
import ResponseError, { ErrorCode } from '../error';
import { UserData, LoginUserData, UpdateUserData } from '../types';

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

    async register({ email, password, name, company }: UserData) {
        const invalidCredentailReasons = [!email, !password, !name, !company, !validateEmail(email), !validatePassword(password)];
        const invalidCredentailReasonIndex = invalidCredentailReasons.findIndex(reason => reason);
        if (invalidCredentailReasonIndex !== -1) {
            throw new ResponseError(ErrorCode.INVALID_CREDENTIALS, 'Invalid credentials');
        }
        const existingUser = await User.findOne({ email }).lean();
        if (existingUser) {
            throw new ResponseError(ErrorCode.EMAIL_ALREADY_REGISTERED, 'Email already registered');
        }
        const passwordHash = await bcrypt.hash(password, 5);
        const userData = await User.create({ email, passwordHash, name, company });
        const { accessToken, accessTokenExpirationTime, refreshToken, refreshTokenExpirationTime } = await this._createAccessToken(userData.id);
        return { email: userData.email, id: userData.id, accessToken, accessTokenExpirationTime, refreshToken, refreshTokenExpirationTime, name, company };
    }

    async update(dataToUpdate: UpdateUserData) {
        const { email, name, id } = dataToUpdate;
        const invalidCredentailReasons = [!email, !name, !validateEmail(email)];
        const invalidCredentailReasonIndex = invalidCredentailReasons.findIndex(reason => reason);
        if (invalidCredentailReasonIndex !== -1) {
            throw new ResponseError(ErrorCode.INVALID_CREDENTIALS, 'Invalid credentials');
        }
        const userData = await User.findByIdAndUpdate(id, { email, name }, { new: true });
        if (!userData) return;
        const formattedUserData = { ...userData.toJSON(), id };

        return formattedUserData;
    }

    async login({ email, password }: LoginUserData) {
        const userData = await User.findOne({ email }).lean();
        if (!userData) { throw new ResponseError(ErrorCode.USER_NOT_FOUND, 'User not found') }
        const isPasswordValid = await bcrypt.compare(password, userData.passwordHash);
        if (!isPasswordValid) { throw new ResponseError(ErrorCode.INVALID_CREDENTIALS, 'Invalid credentails') }
        const existingAccessToken = await AccessToken.findOne({ userid: userData._id }).lean();
        if (existingAccessToken) { throw new ResponseError(ErrorCode.ALREADY_LOGGED_IN, 'Already logged in') }
        const { accessToken, accessTokenExpirationTime, refreshToken, refreshTokenExpirationTime } = await this._createAccessToken(userData._id.toString());
        return { email: userData.email, id: userData._id.toString(), accessToken, accessTokenExpirationTime, refreshToken, refreshTokenExpirationTime, name: userData.name, company: userData.company };
    }

    async getUserById(userId: string) {
        const userData = await User.findById(userId).lean();
        const { _id, email, name, company } = userData;
        return { id: _id.toString(), email, name, company };
    }

}


export default new UserService();