import { Subcommand } from '@made-simple/discord.js';
import { addUserToNotifyList, crops, getName } from './index.js';

export default new Subcommand('subscribe')
    .setDescription(
        'Get notified when a farming contest starts that includes a crop you want to farm.'
    )
    .addStringOption((option) =>
        option
            .setName('crop')
            .setDescription(
                'The crop you want to be notified about. Leave blank for all.'
            )
            .setRequired(false)
            .addChoices(
                { name: 'Wheat', value: 'wheat' },
                { name: 'Carrot', value: 'carrot' },
                { name: 'Potato', value: 'potato' },
                { name: 'Pumpkin', value: 'pumpkin' },
                { name: 'Melon', value: 'melon' },
                { name: 'Cocoa Beans', value: 'cocoa' },
                { name: 'Cactus', value: 'cactus' },
                { name: 'Sugar Cane', value: 'sugar_cane' },
                { name: 'Nether Wart', value: 'nether_wart' },
                { name: 'Mushroom', value: 'mushroom' },
                { name: 'All', value: 'all' }
            )
    )
    .setExecutor(async (_, interaction) => {
        await interaction.deferReply({
            ephemeral: true
        });

        let cropChoice = interaction.options.getString('crop', false);
        if (!cropChoice) cropChoice = 'all';

        const cropName = getName(cropChoice);

        const userId = interaction.user.id;
        const cropExists = crops.includes(cropChoice);

        if (!cropExists && cropChoice !== 'all') {
            await interaction.editReply({
                content: `**${cropName}** is not a valid crop name.`
            });
            return;
        }

        if (cropChoice === 'all') {
            for (const crop of crops) {
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                await addUserToNotifyList(crop, userId).catch(() => {}); // no need for this, junk 'all'
            }

            await interaction.editReply({
                content:
                    'You will now be notified when any farming contest is about to start.'
            });
        } else {
            await addUserToNotifyList(cropChoice, userId)
                .catch(async (err: Error) => {
                    await interaction.editReply({
                        content: err.message
                    });
                })
                .then(async () => {
                    await interaction.editReply({
                        content: `You will now be notified when a farming contest including **${cropName}** is about to start.`
                    });
                });
        }
    });
