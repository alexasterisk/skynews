import { Client } from '@made-simple/discord.js';
import { EmbedBuilder, MessageCreateOptions } from 'discord.js';
import { keyv } from '../index.js';
import { CronJob } from 'cron';
import {
    cropEmojis,
    getName,
    FarmingContestNotifyList
} from '../../commands/jacobs/index.js';
import { getFarmingContestData } from '../../api/strassburger/jacobscontests.js';
import { getRandomFooter } from '../index.js';

let sentNewSeasonAlert = false;
const NEW_SEASON_EMBED = new EmbedBuilder()
    .setTitle('New Season Started!')
    .setDescription(
        "Since there's no API for Jacob's Contests, this bot will temporarily be inactive while the list gets manually updated by KartoffelChips.\nSorry for the inconvenience!"
    )
    .setColor('Purple');

const NEW_LIST_RECEIVED_EMBED = new EmbedBuilder()
    .setTitle('New Contest List Received!')
    .setDescription(
        'New contest list received from **jacobs.strassburger.org**, bot is now ready again!'
    )
    .setColor('Green');

const FARMING_CONTEST_EMBED = new EmbedBuilder().setColor('Yellow');

const COULDNT_FETCH_DATA = new EmbedBuilder()
    .setTitle('Could not fetch data!')
    .setDescription(
        'Could not fetch data from **jacobs.strassburger.org**.\nWill still retry in an hour.'
    )
    .setColor('Red');

const sendMessage = async (
    client: Client<object>,
    message: MessageCreateOptions
) => {
    const registeredGuilds = (await keyv.get('registeredGuilds')) || [];
    const guilds = client.guilds.cache.filter((guild) =>
        registeredGuilds.includes(guild.id)
    );

    for (const guild of guilds.values()) {
        if (!guild.available) continue;

        const channel = await keyv.get(`guilds-${guild.id}-news`);
        if (!channel) continue;

        const channelObj = guild.channels.cache.get(channel);
        if (!channelObj || !channelObj.isTextBased()) continue;

        await channelObj.send(message);
    }
};

let client: Client<object>;
export const loop = new CronJob(
    '0 10 * * * *',
    async () => {
        const strassburgerData = await getFarmingContestData().catch(
            async () => {
                client.user?.setStatus('dnd');

                await sendMessage(client, {
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

        if (!nextContest) {
            if (!sentNewSeasonAlert) {
                await sendMessage(client, {
                    embeds: [
                        NEW_SEASON_EMBED.setFooter({
                            text: getRandomFooter()
                        })
                    ]
                });
                sentNewSeasonAlert = true;
            }

            client.user?.setStatus('invisible');

            return;
        }

        if (sentNewSeasonAlert) {
            await sendMessage(client, {
                embeds: [
                    NEW_LIST_RECEIVED_EMBED.setFooter({
                        text: getRandomFooter()
                    })
                ]
            });
            sentNewSeasonAlert = false;
        }

        client.user?.setStatus('online');

        let description = '';

        for (const crop of nextContest.crops) {
            description += `* ${cropEmojis[crop]} **${getName(crop)}**\n`;
        }

        FARMING_CONTEST_EMBED.setTitle(
            `Farming Contest Starting in <t:${Math.floor(
                nextContest.time.getTime() / 1000
            )}:R>!`
        )
            .setDescription(description)
            .setFooter({
                text: getRandomFooter()
            });

        await sendMessage(client, {
            embeds: [FARMING_CONTEST_EMBED]
        });

        const notifyList = (await keyv.get(
            'jacobs-notify'
        )) as FarmingContestNotifyList;
        if (!notifyList) return;

        let messaged: string[] = [];
        for (const crop in notifyList) {
            if (!nextContest.crops.includes(crop)) continue;

            for (const userId of notifyList[crop]) {
                if (messaged.includes(userId)) continue;

                const user = await client.users.fetch(userId);
                if (!user) continue;

                await user.send({
                    embeds: [FARMING_CONTEST_EMBED]
                });

                messaged.push(userId);
            }
        }

        messaged = [];
    },
    null,
    false
);

export const setClient = (c: Client<object>) => {
    client = c;
};

export default loop;
