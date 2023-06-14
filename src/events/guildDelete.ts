import { Event } from '@made-simple/discord.js';
import { keyv } from '../util/index.js';

export default new Event('guildDelete').setExecutor(async (_, guild) => {
    await keyv.delete(`guilds-${guild.id}-news`);

    const registeredGuilds = (await keyv.get('registeredGuilds')) || [];

    if (registeredGuilds.includes(guild.id)) {
        registeredGuilds.splice(registeredGuilds.indexOf(guild.id), 1);
        await keyv.set('registeredGuilds', registeredGuilds);
    }
});
