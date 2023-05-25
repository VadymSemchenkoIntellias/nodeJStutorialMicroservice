import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ErrorCode } from './error';
import { Token } from 'typescript';

export type ErrorMessage = { code: ErrorCode, error?: Error };

export type LoginUserData = {
    email: string;
    password: string;
}

export type UserData = {
    email: string;
    password: string;
    name: string;
    company: string;
}

export type UpdateUserData = Omit<UserData, 'password' | 'company'> & { id: string };

export type CreateOrLoginUserResponseBody = {
    id: string;
    accessToken: string;
    accessTokenExpirationTime: number;
    refreshToken: string;
    refreshTokenExpirationTime: number;
    name: string;
    company: string;
}

export type RefreshTokenResponseBody = Omit<CreateOrLoginUserResponseBody, 'id' | 'name' | 'company'>;

export type LogoutUserResponseBody = {
    userId: string;
}


export type CreateOrLoginUserResponse = Response<CreateOrLoginUserResponseBody | ErrorMessage>;

export type UpdateUserResponse = Response<{ name: string, email: string, id: string } | ErrorMessage>;

export type LoginUserRequest = Request<ParamsDictionary, CreateOrLoginUserResponseBody, LoginUserData>;

export type CreateUserRequest = Request<ParamsDictionary, CreateOrLoginUserResponseBody, UserData>;

export type LogoutUserResponse = Response<LogoutUserResponseBody | ErrorMessage>;

export type TokenData = { tokenData: { userId: string } };

export type AuthorizedRequest = Request & TokenData;

export type UserPublicData = { email: string, name: string, company: string };

export type GetUserResponse = Response<UserPublicData & { id: string } | ErrorMessage>;

export type RefreshTokenRequest = Request<{ refreshToken: string }>;

export type RefreshTokenResponse = Response<RefreshTokenResponseBody | Error>;

export type UpdateUserRequest = Request<ParamsDictionary, CreateOrLoginUserResponseBody, UpdateUserData> & TokenData;