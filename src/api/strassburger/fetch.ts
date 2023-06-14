import { setTopLevel } from '../fetch.js';

const Strassburger = setTopLevel('https://jacobs.strassburger.org/api');

export const fetch = async <T>(path: string): Promise<T | null> => {
    return Strassburger<T>(path);
};

export default fetch;
