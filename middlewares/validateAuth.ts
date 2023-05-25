import { Request, Response, NextFunction } from 'express';
import { AuthorizedRequest } from '../types'
import TokenService from "../TokenService";

export const validateAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            res.status(403).json({ message: 'No authorization header provided' });
        }
        const [_, accessToken] = (authorization as string).split(' ');
        if (!accessToken) {
            res.status(403).json({ message: 'Invalid authorization header provided' });
            return;
        }
        const tokenData = await TokenService.getTokenData(accessToken);
        if (!tokenData) {
            res.status(403).json({ message: 'The token is not actual' });
            return;
        }
        if (tokenData.expirationTime < Date.now()) {
            await TokenService.deleteToken(accessToken);
            res.status(403).json({ message: 'Token expired' });
            return;
        }
        (req as AuthorizedRequest).tokenData = tokenData;
        next();
    } catch (e) {
        res.status(404).json(e)
    }
}

export const validateBasicAuth = async (req: Request, res: Response, next: NextFunction) => {
    const [authType, base64Credentials] = req.headers.authorization!.split(' ');

    if (authType.toLowerCase() !== 'basic') {
        res.status(401).send('Basic authentication is required');
        return;
    }

    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');
    if (username !== 'products-mircoservice' || password !== '123456') {
        res.status(403).json({ message: 'The basic auth creds are incorrect' });
        return;
    }
    // At this point, you have access to the username and password

    next();
    return;
}