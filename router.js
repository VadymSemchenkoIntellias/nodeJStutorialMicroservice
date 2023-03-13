import Router from 'express';

const router = new Router();

router.post('/register', async (req, res) => {
    try {
        await Promise.resolve();
        res.status(201).json({ user: req.body });
    } catch (e) {
        res.status(500).json(e)
    }
})

export default router;
