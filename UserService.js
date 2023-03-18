import bcrypt from "bcryptjs";
import User from "./User.js";


class UserService {
    async register({ email, password }) {

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