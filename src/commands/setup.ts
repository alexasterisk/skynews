import { Command } from '@made-simple/discord.js';
import { keyv } from '../util/index.js';
import { Message } from 'discord.js';

export default new Command('setup', {
    allowedInDMs: false
})
    .setDescription('Setup SkyNews in your server.')
    .setDefaultMemberPermissions(8240)
    .setExecutor(async (_, interaction) => {
        const guild = interaction.guild;
        if (!guild) return;

        const first = await interaction.reply(
            'What channel should SkyNews post in?'
        );

        const filter = (message) =>
            message.author.id === interaction.member?.user.id;
        const collector = interaction.channel?.createMessageCollector({
            filter,
            time: 60000
        });

        const tries: Message[] = [];
        collector?.on('collect', async (message) => {
            const channel = message.mentions.channels.first();
            if (!channel) {
                tries.push(
                    await interaction.followUp('Please mention a channel.')
                );
                return;
            }

            await keyv.set(`guilds-${guild.id}-news`, channel.id);
            const last = await interaction.followUp(
                `SkyNews will now post in ${channel}.`
            );

            const registeredGuilds = (await keyv.get('registeredGuilds')) || [];

            if (!registeredGuilds.includes(guild.id)) {
                registeredGuilds.push(guild.id);
                await keyv.set('registeredGuilds', registeredGuilds);
            }

            await message.delete();
            collector.stop();

            setTimeout(async () => {
                await last.delete();
            }, 5000);
        });

        collector?.on('end', async (collected) => {
            await first.delete();

            for (const tryMessage of tries) {
                await tryMessage.delete();
            }

            if (collected.size === 0) {
                await first.delete();
                const last = await interaction.followUp('Setup aborted.');

                setTimeout(async () => {
                    await last.delete();
                }, 5000);
            }
        });
    });
