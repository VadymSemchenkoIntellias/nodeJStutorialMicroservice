import Router from 'express';

const router = new Router();

router.post('/user', async (req, res) => {
    console.log('CREATE USER ATTEMPT');
    try {
        await Promise.resolve();
        res.status(201).json({ user: 'Vadym' });
    } catch (e) {
        res.status(500).json(e)
    }
})

export default router;
