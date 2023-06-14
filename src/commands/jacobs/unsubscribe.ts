import { Subcommand } from '@made-simple/discord.js';
import { removeUserFromNotifyList, crops, getName } from './index.js';

export default new Subcommand('unsubscribe')
    .setDescription(
        'Stop being notified when a farming contest starts for certain crops.'
    )
    .addStringOption((option) =>
        option
            .setName('crop')
            .setDescription(
                'The crop you no longer want to be notified about. Leave blank for all.'
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
                { name: 'Mushroom', value: 'mushroom' }
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

        if (!cropExists) {
            await interaction.editReply({
                content: `**${cropName}** is not a valid crop name.`
            });
            return;
        }

        if (cropChoice === 'all') {
            for (const crop of crops) {
                await removeUserFromNotifyList(crop, userId);
            }

            await interaction.editReply({
                content:
                    'You will no longer be notified when any farming contest is about to start.'
            });
        } else {
            await removeUserFromNotifyList(cropChoice, userId);

            await interaction.editReply({
                content: `You will no longer be notified for **${cropName}** farming contests.`
            });
        }
    });
