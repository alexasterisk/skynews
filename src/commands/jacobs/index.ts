import { keyv } from '../../util/index.js';
import { SubcommandGroup } from '@made-simple/discord.js';

export default new SubcommandGroup('jacobs', {
    allowedInDMs: true
}).setDescription("Commands related to Jacob's contests.");

// Farming Contest Settings
export interface CropOption {
    name: string;
    subscribed: boolean;
}

export interface FarmingContestSettings {
    subscribedTo: CropOption[];
}

export const crops = [
    'wheat',
    'carrot',
    'potato',
    'pumpkin',
    'melon',
    'cocoa',
    'cactus',
    'sugar_cane',
    'nether_wart',
    'mushroom'
];

export const cropEmojis = {
    wheat: '<:wheat:1118399336062136350>',
    carrot: '<:carrot:1118399184630993047>',
    potato: '<:potato:1118399268328325220>',
    pumpkin: '<:pumpkin:1118399286183473162>',
    melon: '<:melon:1118399216490913902>',
    cocoa: '<:cocoa:1118399201185890335>',
    cactus: '<:cactus:1118399167539204147>',
    sugar_cane: '<:sugar_cane:1118399321814089770>',
    nether_wart: '<:nether_wart:1118399246786375780>',
    mushroom: '<:mushroom:1118399231506518036>'
};

export const populateCrops = (settings: FarmingContestSettings) => {
    const subscribedTo = settings.subscribedTo;
    for (const crop of crops) {
        if (!subscribedTo.find((c) => c.name === crop)) {
            subscribedTo.push({
                name: crop,
                subscribed: false
            });
        }
    }

    for (const crop of subscribedTo) {
        if (!crops.includes(crop.name)) {
            subscribedTo.splice(subscribedTo.indexOf(crop), 1);
        }
    }

    return settings;
};

export const getName = (crop: string) => {
    return crop.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
};

// Farming Contest Notify List
export interface FarmingContestNotifyList {
    [key: string]: string[];
}

export const addUserToNotifyList = async (crop: string, userId: string) => {
    let notifyList = (await keyv.get(
        'jacobs-notify'
    )) as FarmingContestNotifyList;
    if (!notifyList) {
        notifyList = {};
    }

    let cropList = notifyList[crop];
    if (!cropList) {
        cropList = [];
    }

    if (cropList.includes(userId)) {
        throw new Error(`You are already subscribed to **${getName(crop)}**.`);
    }

    cropList.push(userId);
    notifyList[crop] = cropList;

    await keyv.set('jacobs-notify', notifyList);

    let userData = await keyv.get(`userData-${userId}`);
    if (!userData) {
        userData = {
            farmingNotifier: {
                subscribedTo: []
            }
        };
    } else if (!userData.farmingNotifier) {
        userData.farmingNotifier = {
            subscribedTo: []
        };
    }

    userData.farmingNotifier = populateCrops(userData.farmingNotifier);

    const cropOption = userData.farmingNotifier.subscribedTo.find(
        (c) => c.name === crop
    );

    if (cropOption) {
        cropOption.subscribed = true;
    }

    await keyv.set(`userData-${userId}`, userData);
};

export const removeUserFromNotifyList = async (
    crop: string,
    userId: string
) => {
    const notifyList = (await keyv.get(
        'jacobs-notify'
    )) as FarmingContestNotifyList;
    if (!notifyList)
        throw new Error(
            "No notify list found. (this isn't a bug, just no one is subscribed to anything yet)"
        );

    const cropList = notifyList[crop];
    if (!cropList)
        throw new Error(`No one is subscribed to **${getName(crop)}** yet!`);

    if (!cropList.includes(userId))
        throw new Error(`You are not subscribed to **${getName(crop)}**!`);

    cropList.splice(cropList.indexOf(userId), 1);

    notifyList[crop] = cropList;

    await keyv.set('jacobs-notify', notifyList);

    const userData = await keyv.get(`userData-${userId}`);
    if (!userData)
        throw new Error(
            'No user data found. (this may be a bug, or you may have never used the bot before)'
        );
    else if (!userData.farmingNotifier) return;

    const farmingNotifier = userData.farmingNotifier;
    if (!farmingNotifier.subscribedTo) return;

    const cropOption = farmingNotifier.subscribedTo.find(
        (c) => c.name === crop
    );
    if (cropOption) {
        cropOption.subscribed = false;
    }

    userData.farmingNotifier = farmingNotifier;

    await keyv.set(`userData-${userId}`, userData);
};
