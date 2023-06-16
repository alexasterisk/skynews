import { Subcommand } from '@made-simple/discord.js';
import { keyv } from '../../util/index.js';

export default new Subcommand('disable')
    .setDescription("Disables Jacob's Farming Contest notifications.")
    .setExecutor(async (_, interaction) => {
        await interaction.deferReply();

        const { guild } = interaction;
        if (!guild) throw new Error('Not in a server.');

        const registeredGuilds = (await keyv.get('jacobs-enabled')) || [];

        if (registeredGuilds.includes(guild.id)) {
            registeredGuilds.splice(registeredGuilds.indexOf(guild.id), 1);
            await keyv.set('jacobs-enabled', registeredGuilds);
        } else {
            await interaction.editReply({
                content:
                    "Jacob's Farming Contest notifications are already disabled in this server."
            });

            return;
        }

        await interaction.editReply(
            `Jacob's Farming Contest notifications have been disabled.`
        );
    });
