import UserService from "./UserService";
import TokenService from "./TokenService";
import ExternalService from "./ExternalService";

import { CreateUserRequest, LoginUserRequest, CreateOrLoginUserResponse, LogoutUserResponse, ErrorMessage, AuthorizedRequest, GetUserResponse, RefreshTokenRequest, RefreshTokenResponse, UpdateUserRequest, UpdateUserResponse, TokenData } from './types';
import { Request } from "express";
import ResponseError, { ErrorCode } from "./error";

class UserController {
    /**
     * @swagger
     * components:
     *  schemas:
     *    CreateUserData:
     *      type: object
     *      properties:
     *        name:
     *          type: string
     *          description: The user's name.
     *          example: Leanne Graham
     *        email:
     *          type: string
     *          description: The user's email
     *          example: The user's email
     *        password:
     *          type: string
     *          description: The user's password
     *          example: adhjadj
     *        company:
     *          type: string
     *          description: The user's company
     *          example: Umbrella corporation
     * /api/create:
     *  post:
     *    description: Create a new user
     *    requestBody:
     *      content:
     *        application/json:
     *          schema:
     *            $ref: '#/components/schemas/CreateUserData'
     *    responses:
     *      '201':
     *        description: User successfully created
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                email:
     *                  type: string
     *                  example: some@email.com
     *                id:
     *                  type: string
     *                  example: some-dummy-id
     *                accessToken:
     *                  type: string
     *                  example: some-dummy-token
     *                accessTokenExpirationTime:
     *                  type: number
     *                  example: 1234567890
     *                refreshToken:
     *                  type: string
     *                  example: some-dummy-refresh-token
     *                refreshTokenExpirationTime:
     *                  type: number
     *                  example: 1234567890
     *                name:
     *                  type: string
     *                  example: Vaduard
     *                company:
     *                  type: string
     *                  example: Umbrella
     */
    async create(req: CreateUserRequest, res: CreateOrLoginUserResponse) {
        try {
            const user = await UserService.register(req.body);
            res.status(201).json(user);
        } catch (error: unknown) {
            let status;
            switch ((error as ResponseError).code) {
                case ErrorCode.EMAIL_ALREADY_REGISTERED:
                    status = 409;
                    break;
                case ErrorCode.INVALID_CREDENTIALS:
                    status = 400;
                    break;
                case ErrorCode.ALREADY_LOGGED_IN:
                    status = 208;
                    break;
                default:
                    status = 500;
                    break;
            }
            res.status(status).json({ code: (error as ResponseError).code });
        }
    }

    /**
     * @swagger
     * /api/updateUser:
     *  put:
     *    description: Update user information
     *    responses:
     *      '200':
     *        description: User successfully updated
     */
    async updateUser(req: Request, res: UpdateUserResponse) {
        const { tokenData: { userId }, body: { name, email } } = req as Request & TokenData;
        try {
            const user = await UserService.update({ name, email, id: userId });
            await ExternalService.updateProductOwner({ name, email, id: userId });
            res.status(200).json(user);
        } catch (error: unknown) {
            let status;
            switch ((error as ResponseError).code) {
                case ErrorCode.EMAIL_ALREADY_REGISTERED:
                    status = 409;
                    break;
                case ErrorCode.INVALID_CREDENTIALS:
                    status = 400;
                    break;
                case ErrorCode.ALREADY_LOGGED_IN:
                    status = 208;
                    break;
                default:
                    status = 500;
                    break;
            }
            res.status(status).json({ code: (error as ResponseError).code });
        }
    }

    /**
    * @swagger
    * /api/logout:
    *  post:
    *    description: Log out a user
    *    responses:
    *      '200':
    *        description: User successfully logged out
    */
    async logout(req: Request, res: LogoutUserResponse) {
        try {
            const { authorization } = req.headers;
            if (!authorization) {
                res.status(403).json({ code: ErrorCode.NO_AUTH_HEADER_PROVIDED });
                return;
            }
            authorization.split(' ');
            const [_, accessToken] = authorization.split(' ');
            if (!accessToken) {
                res.status(403).json({ code: ErrorCode.INVALID_AUTH_HEADER_PROVIDED });
                return;
            }
            const tokenData = await TokenService.deleteToken(accessToken);
            if (!tokenData) {
                res.status(404).json({ code: ErrorCode.TOKEN_IS_NOT_ACTUAL });
                return;
            }
            res.status(200).json({ userId: tokenData.userId });
        } catch (error) {
            res.status(500).json({ code: ErrorCode.UNHANDLED_SERVER_ERROR, error: error as ResponseError });
        }
    }

    /**
     * @swagger
     * /api/login:
     *  post:
     *    description: Log in a user
     *    responses:
     *      '200':
     *        description: User successfully logged in
     */
    async login(req: LoginUserRequest, res: CreateOrLoginUserResponse) {
        try {
            const user = await UserService.login(req.body);
            res.status(200).json(user);
        } catch (error: unknown) {
            let status;
            switch ((error as ResponseError).code) {
                case ErrorCode.EMAIL_ALREADY_REGISTERED:
                    status = 409;
                    break;
                case ErrorCode.INVALID_CREDENTIALS:
                    status = 400;
                    break;
                default:
                    status = 500;
                    break;
            }
            res.status(status).json({ code: (error as ResponseError).code, error: error as ResponseError });
        }
    }

    /**
     * @swagger
     * /api/getUserData:
     *  get:
     *    description: Retrieve user data
     *    responses:
     *      '200':
     *        description: User data successfully retrieved
     */
    async getUserData(req: Request, res: GetUserResponse) {
        try {
            const { userId } = (req as AuthorizedRequest).tokenData;
            const userData = await UserService.getUserById(userId);
            if (!userData) {
                res.status(404).json({ code: ErrorCode.USER_NOT_FOUND });
            }
            res.status(200).json(userData);
        } catch (e) {
            res.status(404).json(e as ResponseError);
        }
    }

    /**
     * @swagger
     * /api/getUserDataById:
     *  get:
     *    description: Retrieve user data by ID
     *    responses:
     *      '200':
     *        description: User data successfully retrieved
     */
    async getUserDataById(req: Request, res: GetUserResponse) {
        try {
            const { id } = req.params;
            const userData = await UserService.getUserById(id);
            if (!userData) {
                res.status(404).json({ code: ErrorCode.USER_NOT_FOUND });
            }
            res.status(200).json(userData);
        } catch (e) {
            res.status(404).json(e as ResponseError);
        }
    }

    /**
     * @swagger
     * /api/refreshToken:
     *  post:
     *    description: Refresh a user's token
     *    responses:
     *      '200':
     *        description: Token successfully refreshed
     */
    async refreshToken(req: RefreshTokenRequest, res: RefreshTokenResponse) {
        try {
            const { refreshToken } = req.body;
            const tokenData = await TokenService.refreshToken(refreshToken);
            res.status(200).json(tokenData);
        } catch (e) {
            res.status(401).json(e as Error);
        }
    }

}


export default new UserController();
