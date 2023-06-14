import fetch from '../../fetch.js';

interface ProfileResponse {
    id: string;
    name: string;
}

export interface Profile {
    uuid: string;
    username: string;
}

export const getProfileFromUsername = async (
    username: string
): Promise<Profile | null> => {
    const response = await fetch<ProfileResponse>(
        '/users/profiles/minecraft/' + username
    );

    if (!response) return null;

    return {
        uuid: response.id,
        username: response.name
    };
};

export const isUUID = (uuid: string): boolean => {
    if (uuid.includes('-')) return true;
    if (uuid.length !== 32) return false;
    return /^[0-9a-fA-F]+$/.test(uuid);
};
