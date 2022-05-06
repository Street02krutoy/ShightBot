import { SlashCommandBuilder } from "@discordjs/builders";

export const options = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Посмотреть задержку бота.")
    .toJSON();
export const permission = 0;

import prettyms from "pretty-ms";
import { CommandInteraction } from "discord.js";

export async function run(interaction: CommandInteraction) {
    interaction.reply("падаждити").then(async () => {
        const server = Date.now() - interaction.createdTimestamp;
        const uptime = prettyms(interaction.client.uptime);
        const api = Math.ceil(interaction.guild.shard.ping);
        await interaction.editReply(`🏓 Понг! Сервер: \`${server}ms\`, API: \`${api}ms\`, Аптайм: \`${uptime}\``);
    })
};
