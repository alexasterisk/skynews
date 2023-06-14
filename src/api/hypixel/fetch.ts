/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { RequestInit } from 'node-fetch';
import { setTopLevel } from '../fetch.js';

const Hypixel = setTopLevel('https://api.hypixel.net', {
    headers: {
        'API-Key': process.env.HYPIXEL_API_KEY!
    }
});

export const fetch = async <T>(
    path: string,
    init?: RequestInit
): Promise<T | null> => {
    return Hypixel<T>(path, init);
};

export default fetch;
