import { Command } from '@made-simple/discord.js';
import { keyv } from '../util/index.js';
import { getPlayer } from '../api/hypixel/player.js';

export default new Command('link', {
    allowedInDMs: true
})
    .setDescription('This currently serves no purpose. It will in the future.')
    //.setDescription('Link your Hypixel account to your Discord account.')
    .addStringOption((option) =>
        option
            .setName('username')
            .setDescription('Your Minecraft username.')
            .setRequired(true)
    )
    .setExecutor(async (_, interaction) => {
        await interaction.deferReply({
            ephemeral: true
        });

        const username = interaction.options.getString('username', true);
        const hypixelProfile = await getPlayer(username);

        if (!hypixelProfile) {
            await interaction.editReply({
                content: 'That player does not exist.'
            });
            return;
        }

        const discordTag = interaction.user.tag;
        const discordId = interaction.user.id;

        if (typeof hypixelProfile.discordTag !== 'string') {
            await interaction.editReply({
                content:
                    'Please link your Discord account to your Hypixel account in the Social Media section of your profile and try again!'
            });
            return;
        } else if (hypixelProfile.discordTag !== discordTag) {
            await interaction.editReply({
                content:
                    'Discord tag does not match on your Hypixel profile. Please change it and try again!'
            });
            return;
        }

        await keyv.set(`hypixel-${hypixelProfile.uuid}-discord`, discordId);
        await keyv.set(`discord-${discordId}-hypixel`, hypixelProfile.uuid);
        await interaction.editReply({
            content: 'Your account has been linked!'
        });
    });
