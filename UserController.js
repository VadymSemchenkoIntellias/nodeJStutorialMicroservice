import User from "./User.js";
import UserService from "./UserService.js";

class UserController {
    async create(req, res) {
        try {
            const user = await UserService.register(req.body);
            res.json(user);
        } catch (e) {
            console.log('ERROR', e);
            res.status(500).json(e)
        }
    }

}


export default new UserController();
