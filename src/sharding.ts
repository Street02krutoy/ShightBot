require("nodejs-better-console").overrideConsole();
import { ShardingManager } from 'discord.js';
import config from '../config';
import readline from "readline";
import { inspect } from "util";

import Util from "./Util";

const read = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

export const manager: ShardingManager = new ShardingManager('./build/src/index.js', { token: config.client.token });

manager.on('shardCreate', async shard => {
    let shardName: string = `[Shard ${shard.id}]`;
    console.log(`${shardName} Has been successfully created. `)
});

read.on("line", async (line) => {
    let _manager = manager;
    if (!line) return;
    console.log(`[Manager CLI] Received command: ${line}`);
    if (line.startsWith("eval")) {
        const script = line.slice(5);
        console.log(`[Manager CLI] Evaluating: ${script}`);
        try {
            console.log(`[Manager CLI] Result:`, inspect(await eval(script), { depth: 2 }));
        } catch (e) {
            console.error(`[Manager CLI] Error: ${e}`);
        };
    };
});

manager.spawn();