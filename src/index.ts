import { Client } from 'discord.js';
import mongoose from "mongoose";
import config from '../config';
import Util from './Util';

export const client = new Client({ intents: ["GuildMembers"] });

const spawnWeb = () => { console.log("[Client] trying to spawn web"); require('./web'); }

client.once("shardReady", async (shardId: number) => {
    let shard: string = `[Shard ${shardId}]`;
    await client.guilds.fetch();
    require("./handlers/interactions/commands").registerCommands(client).then(() => {
        console.log(`${shard} Refreshed slash commands.`);
    }).catch((err) => { console.warn(err) });
});

client.once("ready", async () => {
    console.log("Logged in as " + client.user.tag + " (" + client.user.id + ")")
    mongoose.connect(config.database.uri).then(() => {
        Util.setDatabase(mongoose)
        console.log("Database has been set successfully!")
        Util.setClient(client)
        if (config.web.port) spawnWeb()
    });
})

client.on("interactionCreate", require('./handlers/interactions'));

client.login(config.client.token);

process.on("unhandledRejection", (rej) => { console.error(rej) });