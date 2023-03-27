

import jwt from 'jsonwebtoken';
import { JWT_KEY } from '../constants.js';


export const validateAuth = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            res.status(403).json({ message: 'No authorization header provided' });
        }
        const [_, accessToken] = authorization.split(' ');
        if (!accessToken) {
            res.status(403).json({ message: 'Invalid authorization header provided' });
        }

        const { id } = jwt.verify(accessToken, JWT_KEY);
        req.userId = id;
        next();
    } catch (e) {
        console.log('ERROR', e);
        res.status(404).json(e)
    }
}