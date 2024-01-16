import { UserLogin } from '@/types/data/user';

export const buildFormDataPayloadString = (json: Record<string, unknown>) => {
    const keys = Object.keys(json);
    let payloadString = '';

    for (const [index, key] of keys.entries()) {
        const isLastKey = index === keys.length - 1;
        payloadString += `${key}=${json[key]}${isLastKey ? '' : '&'}`;
    }

    return payloadString;
};

/**
 * Backend is expecting a field called username instead of email: https://fastapi.tiangolo.com/tutorial/security/simple-oauth2/
 */
export const parseLoginData = ({ email, password }: UserLogin) => ({
    username: email,
    password,
});
