import { Client, CommandInteraction } from "discord.js";

//was stolen from https://github.com/itzJOHv/djohbot

export default async (interaction: CommandInteraction) => {
    const processCommand = async (interaction: CommandInteraction) => {
        const commandName = interaction.commandName;
        try {
            const commandFile = require(`../../commands/${commandName}`);
            commandFile.run(interaction);
        }catch (e) {
            await interaction.reply({ content: `❌ Бот не может обработать эту команду\nЛог ошибки. Сообщите разработчику:\n ||${e.message.split("\n").join(" ")}||`, ephemeral: true })
        }
        //if (permissionLevel < commandFile.permission) return await interaction.reply({ content: "❌ Недостаточно прав.", ephemeral: true });
    };
    await processCommand(interaction);
};

import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import fs from "fs";
import config from "../../../config";
const commands = [];
const rest = new REST({ version: "9" }).setToken(config.client.token);

export const registerCommands = async (client: Client) => {
    const files = fs.readdirSync(__dirname + "/../../commands/");

    for (let filename of files) {
        let file = require(`../../commands/${filename}`);

        file.options ? commands.push(file.options) : null;
    };

    await Promise.all(client.guilds.cache.map(async (guild) => {
        return await rest.put(Routes.applicationGuildCommands(client.user.id, guild.id), { body: commands }).catch((err) => {
            if (!err.message.toLowerCase().includes("missing")) console.error(err.message);
        });
    }));
};