import fetch from './fetch.js';
import {
    getProfileFromUsername,
    isUUID
} from '../mojang/users/profiles/minecraft.js';
import { FarmingContestSettings } from '../../commands/jacobs/index.js';

interface PlayerResponse {
    success: boolean;
    cause?: string;
    player: {
        uuid: string;
        displayname: string;
        socialMedia?: {
            links?: {
                DISCORD?: string;
            };
        };
    };
}

export interface Player {
    uuid: string;
    username: string;
    discordTag?: string;
}

export interface LinkedPlayer {
    uuid: string;
    username: string;
    discordTag: string;
    farmingNotifier?: FarmingContestSettings;
}

export const getPlayer = async (user: string): Promise<Player | null> => {
    if (!isUUID(user)) {
        const profile = await getProfileFromUsername(user);
        if (!profile) return null;
        user = profile.uuid;
    } else {
        user = user.replace(/-/g, '');
    }

    const response = await fetch<PlayerResponse>('/player?uuid=' + user);

    if (!response?.success) return null;

    const player = response.player;

    return {
        uuid: player.uuid,
        username: player.displayname,
        discordTag: player.socialMedia?.links?.DISCORD
    };
};
