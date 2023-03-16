import { verifyIdToken } from './firebase.js';

export const authenticateJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const idToken = authHeader.split(" ")[1];
        try {
            const decodedToken = await verifyIdToken(idToken);
            console.log('DECODED TOKEN', decodedToken);
            next();
        } catch (error) {
            console.log('ERROR', error);
            res.status(403).json(e);
        }
    } else {
        res.sendStatus(401);
    }
};