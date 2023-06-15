import { Subcommand } from '@made-simple/discord.js';
import { EmbedBuilder } from 'discord.js';
import { cropEmojis, getName } from './index.js';
import { getFarmingContestData } from '../../api/strassburger/jacobscontests.js';
import { getRandomFooter } from '../../util/index.js';

const COULDNT_FETCH_DATA = new EmbedBuilder()
    .setTitle('Could not fetch data!')
    .setDescription(
        'Could not fetch data from **jacobs.strassburger.org**.\nWill continue retrying when prompted.'
    )
    .setColor('Red');

export default new Subcommand('next')
    .setDescription('Shows the next 3 farming contests.')
    .setExecutor(async (_, interaction) => {
        const strassburgerData = await getFarmingContestData().catch(
            async () => {
                await interaction.reply({
                    embeds: [
                        COULDNT_FETCH_DATA.setFooter({
                            text: getRandomFooter()
                        })
                    ]
                });
                return;
            }
        );
        const nextContest = strassburgerData?.find(
            (contest) => contest.time > new Date()
        );

        if (!strassburgerData || !nextContest) {
            await interaction.reply({
                content:
                    'Could not find any upcoming farming contests, did a new season start?'
            });
            return;
        }

        const contests = strassburgerData.slice(
            strassburgerData.indexOf(nextContest),
            strassburgerData.indexOf(nextContest) + 3
        );

        const count = contests.length > 3 ? 3 : contests.length;

        const FARMING_CONTEST_EMBED = new EmbedBuilder()
            .setColor('Yellow')
            .setFooter({
                text: getRandomFooter()
            });

        for (let i = 0; i < count; i++) {
            const contest = contests[i];

            let crops = '';
            for (const crop of contest.crops) {
                crops += `${cropEmojis[crop]} **${getName(crop)}**\n`;
            }

            FARMING_CONTEST_EMBED.addFields({
                name:
                    (i === 0 ? 'Next!' : 'Upcoming') +
                    ` <t:${Math.floor(contest.time.getTime() / 1000)}:R>`,
                value: crops,
                inline: true
            });
        }

        await interaction.reply({
            embeds: [FARMING_CONTEST_EMBED]
        });
    });
