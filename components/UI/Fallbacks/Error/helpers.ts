import { HttpStatusCode } from 'axios';

export type ErrorWithStatus = {
    status: keyof typeof errorMessageMap;
};

export const errorTypeGuardMap = {
    withStatus: (error: any): error is ErrorWithStatus => 'status' in error,
};

export const errorMessageMap = {
    [HttpStatusCode.Unauthorized]: 'You have to be logged in to access this resource.',
    [HttpStatusCode.Forbidden]: 'You are not allowed to access this resource. Please contact the owner of this board.',
    [HttpStatusCode.NotFound]: 'Ooops! We are sorry, we could not find any board matching this URL.',
    [HttpStatusCode.UnprocessableEntity]: 'The provided board ID does not match our ID pattern. Please check.',
    [HttpStatusCode.BadGateway]: 'The service is currently unavailable, please try later.'
};
