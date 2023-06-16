import { Subcommand } from '@made-simple/discord.js';
import { keyv } from '../../util/index.js';
import { Guild } from 'discord.js';

export const enable = async (guild: Guild) => {
    const registeredGuilds = (await keyv.get('jacobs-enabled')) || [];

    if (!registeredGuilds.includes(guild.id)) {
        registeredGuilds.push(guild.id);
        await keyv.set('jacobs-enabled', registeredGuilds);
    } else
        throw new Error(
            "Jacob's Farming Contest notifications are already enabled in this server."
        );

    return true;
};

export default new Subcommand('enable')
    .setDescription("Enables Jacob's Farming Contest notifications.")
    .setExecutor(async (_, interaction) => {
        await interaction.deferReply();

        const { guild } = interaction;
        if (!guild) throw new Error('Not in a server.');

        await enable(guild)
            .then(async () => {
                await interaction.editReply({
                    content:
                        "Jacob's Farming Contest notifications have been enabled."
                });

                const notifChannel = await keyv.get(
                    `guild-${guild.id}-jacobs-channel`
                );

                if (!notifChannel) {
                    await interaction.channel?.send({
                        content:
                            'There is no notification channel set! Run `/setup channel` to set one.'
                    });
                }
            })
            .catch(async (error) => {
                await interaction.editReply({
                    content: error.message
                });
            });
    });
