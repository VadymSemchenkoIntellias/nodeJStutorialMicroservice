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
        try {
            const tokenData = await UserService.login(req.body);
            console.log('TOKEN DATA');
            res.status(200).json(tokenData);
        } catch (e) {
            console.log('ERROR', e);
            res.status(500).json(e)
        }
    }

    async findByEmail(req, res) {
        try {
            const user = await UserService.findUserByEmail(req.query.email);
            res.status(200).json(user);
        } catch (e) {
            console.log('ERROR', e);
            res.status(404).json(e)
        }
    }

}


export default new UserController();
