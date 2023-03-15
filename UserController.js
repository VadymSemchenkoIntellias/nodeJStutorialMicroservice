import User from "./User.js";
import UserService from "./UserService.js";

class UserController {
    async create(req, res) {
        try {
            const user = await UserService.register(req.body);
            res.status(201).json(user);
        } catch (e) {
            console.log('ERROR', e);
            res.status(500).json(e)
        }
    }

    async login(req, res) {
        // TODO: use id token veirification https://firebase.google.com/docs/auth/admin/verify-id-tokens
    }

}


export default new UserController();
