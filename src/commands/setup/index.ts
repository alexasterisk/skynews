import { SubcommandGroup } from '@made-simple/discord.js';

export default new SubcommandGroup('setup', {
    allowedInDMs: false
})
    .setDefaultMemberPermissions(8240)
    .setDescription("Settings related to Jacob's Farming Contests. (temp)");
