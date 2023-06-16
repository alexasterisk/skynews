import { Subcommand } from '@made-simple/discord.js';
import { keyv } from '../../util/index.js';
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType
} from 'discord.js';
import { enable } from './enable.js';

export default new Subcommand('channel')
    .setDescription(
        "Set the channel that Jacob's Farming Contests will be posted in."
    )
    .addChannelOption((option) =>
        option
            .setName('channel')
            .setDescription('The channel to post in.')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
    )
    .setExecutor(async (_, interaction) => {
        await interaction.deferReply();

        const channel = interaction.options.getChannel('channel', true, [
            ChannelType.GuildText
        ]);

        await keyv.set(`guild-${channel.guild.id}-jacobs-channel`, channel.id);

        const registeredGuilds = (await keyv.get('jacobs-enabled')) || [];

        if (!registeredGuilds.includes(channel.guild.id)) {
            const yesButton = new ButtonBuilder()
                .setCustomId('yes')
                .setLabel('Yes')
                .setStyle(ButtonStyle.Primary);

            const noButton = new ButtonBuilder()
                .setCustomId('no')
                .setLabel('No')
                .setStyle(ButtonStyle.Danger);

            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                yesButton,
                noButton
            );

            const sentMessage = await interaction.editReply({
                content:
                    "Notifications for the Jacob's Farming Contest are currently not enabled on this server, would you like to enable them?",
                components: [row]
            });

            const collector = sentMessage.createMessageComponentCollector({
                filter: (i) => i.user.id === interaction.user.id,
                time: 60000
            });

            collector.on('collect', async (i) => {
                if (i.customId === 'yes') {
                    collector.stop('yes');
                } else if (i.customId === 'no') {
                    collector.stop('no');
                }
            });

            collector.on('end', async (_, reason) => {
                if (reason === 'yes') {
                    await enable(channel.guild)
                        .catch(async (error) => {
                            await interaction.channel?.send({
                                content: error.message
                            });
                        })
                        .then(async () => {
                            await interaction.channel?.send({
                                content:
                                    "Jacob's Farming Contest notifications have been enabled."
                            });
                        });
                } else if (reason === 'no') {
                    await interaction.channel?.send({
                        content:
                            "Jacob's Farming Contest notifications have not been enabled, but this choice will be remembered."
                    });
                }

                await interaction.editReply({
                    content: `Jacob's Farming Contests notification channel has been set to ${channel}`,
                    components: []
                });
            });
        } else {
            await interaction.editReply(
                `Jacob's Farming Contests notification channel has been set to ${channel}`
            );
        }
    });
