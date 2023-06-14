import fetch from './fetch.js';

interface FarmingContestDataResponse {
    timestamp: number;
    crops: [number, number, number];
}

export interface FarmingContestData {
    time: Date;
    crops: [string, string, string];
}

const cropNames = {
    [0]: 'cactus',
    [1]: 'carrot',
    [2]: 'cocoa',
    [3]: 'melon',
    [4]: 'mushroom',
    [5]: 'nether_wart',
    [6]: 'potato',
    [7]: 'pumpkin',
    [8]: 'sugar_cane',
    [9]: 'wheat'
};

type FarmingContestResponse = FarmingContestDataResponse[];

export const getFarmingContestData = async (): Promise<
    FarmingContestData[] | null
> => {
    const response = await fetch<FarmingContestResponse>('/jacobcontests.json');

    if (!response) return null;

    return response.map((contest) => ({
        time: new Date(contest.timestamp),
        crops: contest.crops.map((crop) => cropNames[crop])
    })) as FarmingContestData[];
};
