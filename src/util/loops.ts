import { Client } from '@made-simple/discord.js';
import jacobsLoop, { setClient } from './jacobs/notify.js';

const readyLoops = [jacobsLoop];

export const start = (client: Client<object>) => {
    setClient(client);
    for (const loop of readyLoops) {
        loop.start();
    }
};

export const stop = () => {
    for (const loop of readyLoops) {
        loop.stop();
    }
};
