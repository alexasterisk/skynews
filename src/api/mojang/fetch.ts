import { setTopLevel } from '../fetch.js';

const Mojang = setTopLevel('https://api.mojang.com');

export const fetch = async <T>(path: string): Promise<T | null> => {
    return Mojang<T>(path);
};

export default fetch;
