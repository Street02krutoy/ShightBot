"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const discord_js_1 = require("discord.js");
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../config"));
const Util_1 = __importDefault(require("./Util"));
exports.client = new discord_js_1.Client({ intents: ["GuildMembers"] });
const spawnWeb = () => { console.log("[Client] trying to spawn web"); require('./web'); };
exports.client.once("shardReady", async (shardId) => {
    let shard = `[Shard ${shardId}]`;
    await exports.client.guilds.fetch();
    require("./handlers/interactions/commands").registerCommands(exports.client).then(() => {
        console.log(`${shard} Refreshed slash commands.`);
    }).catch((err) => { console.warn(err); });
});
exports.client.once("ready", async () => {
    console.log("Logged in as " + exports.client.user.tag + " (" + exports.client.user.id + ")");
    mongoose_1.default.connect(config_1.default.database.uri).then(() => {
        Util_1.default.setDatabase(mongoose_1.default);
        console.log("Database has been set successfully!");
        Util_1.default.setClient(exports.client);
        if (config_1.default.web.port)
            spawnWeb();
    });
});
exports.client.on("interactionCreate", require('./handlers/interactions'));
exports.client.login(config_1.default.client.token);
process.on("unhandledRejection", (rej) => { console.error(rej); });
