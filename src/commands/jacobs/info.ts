import { Subcommand } from '@made-simple/discord.js';
import { EmbedBuilder } from 'discord.js';

const INFO_EMBED = new EmbedBuilder()
    .setTitle('How it works (and how to use it yourself)')
    .setDescription(
        "This bot uses the JSON file found on [jacobs.strassburger.org](https://jacobs.strassburger.org) to get the farming contests as Hypixel doesn't have a public API for farming contests yet. jacobs.strassburger.org is ran and owned by KartoffelChips#0445.\n\nIf you want to use this API for yourself it is exposed by KartoffelChips [here!](https://jacobs.strassburger.org/api/jacobcontests.json) It also has a [GitHub](https://github.com/KartoffelChipss/jacob-contests).\n\nEven though the API is managed by KartoffelChips, the developer of this bot is alex*#2348 (me). This Discord bot is also open source, you can find it [here on GitHub](https://github.com/alexasterisk/skynews)."
    )
    .setColor('Blue');

export default new Subcommand('info')
    .setDescription('Shows information about the Farming Contest API.')
    .setExecutor(async (_, interaction) => {
        await interaction.reply({
            embeds: [INFO_EMBED]
        });
    });
