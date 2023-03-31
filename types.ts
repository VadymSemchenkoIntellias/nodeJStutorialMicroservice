import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ErrorCode } from './error';

export type ErrorMessage = { code: ErrorCode, error?: Error };

export type CreateOrLoginUserData = {
    email: string;
    password: string;
}

export type CreateOrLoginUserResponseBody = {
    id: string;
    accessToken: string;
    accessTokenExpirationTime: number;
    refreshToken: string;
    refreshTokenExpirationTime: number;
}

export type RefreshTokenResponseBody = Omit<CreateOrLoginUserResponseBody, 'id'>;

export type LogoutUserResponseBody = {
    userId: string;
}

export type CreateOrLoginUserRequest = Request<ParamsDictionary, CreateOrLoginUserResponseBody, CreateOrLoginUserData>;

export type CreateOrLoginUserResponse = Response<CreateOrLoginUserResponseBody | ErrorMessage>;

export type LogoutUserResponse = Response<LogoutUserResponseBody | ErrorMessage>;

export type AuthorizedRequest = Request & { tokenData: { userId: string } };

export type GetUserResponse = Response<{ email: string, id: string } | ErrorMessage>;

export type RefreshTokenRequest = Request<{ refreshToken: string }>;

export type RefreshTokenResponse = Response<RefreshTokenResponseBody | Error>;