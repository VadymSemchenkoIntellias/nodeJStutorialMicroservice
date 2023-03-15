import Router from 'express';
import { createUser } from './firebase.js';

const router = new Router();

router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const userData = await createUser({ email, password });
        res.status(201).json({ userData });
    } catch (e) {
        res.status(500).json(e);
    }
})

export default router;
