import { Client, Event } from '@made-simple/discord.js';
import { ActivityType } from 'discord.js';
import { loops } from '../util/index.js';

export default new Event('ready', true).setExecutor(
    async (client: Client<object>) => {
        client.user?.setActivity({
            name: 'with some contests',
            type: ActivityType.Playing
        });

        client.user?.setStatus('online');

        loops.start(client);
    }
);
