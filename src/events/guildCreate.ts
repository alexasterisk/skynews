import { Client, Event } from '@made-simple/discord.js';
import { ChannelType, TextChannel } from 'discord.js';
import { keyv } from '../util/index.js';

export default new Event('guildCreate').setExecutor(
    async (client: Client<object>, guild) => {
        const registeredGuilds = (await keyv.get('registeredGuilds')) || [];

        if (!registeredGuilds.includes(guild.id)) {
            registeredGuilds.push(guild.id);
            await keyv.set('registeredGuilds', registeredGuilds);
        }

        const channel =
            guild.systemChannel ??
            guild.channels.cache
                .filter(
                    (channel) =>
                        (channel.type === ChannelType.GuildText &&
                            channel
                                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                .permissionsFor(client.user!)
                                ?.has('SendMessages')) ??
                        false
                )
                .first();

        if (channel && channel instanceof TextChannel) {
            const joinMessage = `Thanks for adding SkyNews to your server! Please finish setup by running \`/setup\` in your server.`;

            if (channel.lastMessage) {
                await channel.lastMessage.reply(joinMessage);
            } else {
                await channel.send(joinMessage);
            }
        }
    }
);
