"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.manager = void 0;
require("nodejs-better-console").overrideConsole();
const discord_js_1 = require("discord.js");
const config_1 = __importDefault(require("../config"));
const readline_1 = __importDefault(require("readline"));
const util_1 = require("util");
const read = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout
});
exports.manager = new discord_js_1.ShardingManager('./build/src/index.js', { token: config_1.default.client.token });
exports.manager.on('shardCreate', async (shard) => {
    let shardName = `[Shard ${shard.id}]`;
    console.log(`${shardName} Has been successfully created. `);
});
read.on("line", async (line) => {
    let _manager = exports.manager;
    if (!line)
        return;
    console.log(`[Manager CLI] Received command: ${line}`);
    if (line.startsWith("eval")) {
        const script = line.slice(5);
        console.log(`[Manager CLI] Evaluating: ${script}`);
        try {
            console.log(`[Manager CLI] Result:`, (0, util_1.inspect)(await eval(script), { depth: 2 }));
        }
        catch (e) {
            console.error(`[Manager CLI] Error: ${e}`);
        }
        ;
    }
    ;
});
exports.manager.spawn();
