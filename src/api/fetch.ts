import nodeFetch, { RequestInfo, RequestInit } from 'node-fetch';

export const fetch = async <T>(
    url: RequestInfo | string,
    init?: RequestInit
): Promise<T | null> => {
    const res = await nodeFetch(url, init);
    if (!res.ok) throw new Error(`HTTP Error: ${res.status} ${res.statusText}`);
    return res.json() as T | null;
};

export const setTopLevel = (url: string, init?: RequestInit) => {
    return async <T>(
        reqPath: string,
        reqInit?: RequestInit
    ): Promise<T | null> => {
        if (!reqInit) reqInit = { headers: {} };
        if (init?.headers && typeof reqInit.headers === 'object') {
            for (const header of Object.keys(init.headers)) {
                reqInit.headers[header] = init.headers[header];
            }
        }

        return fetch<T>(url + reqPath, reqInit);
    };
};
