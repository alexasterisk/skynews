import 'dotenv/config';

import { keyv } from './util/index.js';
import { Client } from '@made-simple/discord.js';

keyv.on('error', console.error);

const client = new Client({
    intents: [
        'Guilds',
        'GuildMessages',
        'GuildMembers',
        'DirectMessages',
        'MessageContent'
    ],
    partials: ['Channel', 'GuildMember', 'Message', 'User']
});

const eventsFolder = new URL('events/', import.meta.url);
await client.addEventsFolder(eventsFolder);

const commandsFolder = new URL('commands/', import.meta.url);
await client.addCommandsFolder(commandsFolder);
await client.registerCommands(undefined, '1116970598019629086');

await client.login();
