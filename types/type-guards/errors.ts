import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export type ErrorWithMessageFromBackend = {
    data: { detail: string };
};

/**
 * Type predicate to narrow an unknown error to `FetchBaseQueryError`
 */
export function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
    return typeof error === 'object' && error != null && 'data' in error;
}

export function isGeneralError(error: unknown) {
    return typeof error === 'object' && error != null && 'status' in error && error.status === 'FETCH_ERROR';
}

/**
 * Type predicate to narrow an unknown error to an object with a string 'message' property
 */
export function isErrorWithMessage(error: unknown): error is { message: string } {
    return (
        typeof error === 'object' && error != null && 'message' in error && typeof (error as any).message === 'string'
    );
}

export function isErrorWithMessageFromBackend(error: unknown): error is ErrorWithMessageFromBackend {
    return (
        typeof error === 'object' &&
        error !== null &&
        'data' in error &&
        typeof (error as any).data === 'object' &&
        'detail' in (error as any).data
    );
}
