

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

        const payload = jwt.verify(accessToken, JWT_KEY);
        console.log('PAYLOAD', payload);
        next();

        return;
        const tokenData = await TokenService.getTokenData(accessToken);
        if (!tokenData) {
            res.status(403).json({ message: 'The token is not actual' });
        }
        if (tokenData.expirationTime < Date.now()) {
            await TokenService.deleteToken(accessToken);
            res.status(403).json({ message: 'Token expired' });
        }
        req.tokenData = tokenData;
        next();
    } catch (e) {
        console.log('ERROR', e);
        res.status(404).json(e)
    }
}