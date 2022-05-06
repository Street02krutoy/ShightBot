"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.permission = exports.options = void 0;
const builders_1 = require("@discordjs/builders");
exports.options = new builders_1.SlashCommandBuilder()
    .setName("ping")
    .setDescription("Посмотреть задержку бота.")
    .toJSON();
exports.permission = 0;
const pretty_ms_1 = __importDefault(require("pretty-ms"));
async function run(interaction) {
    interaction.reply("падаждити").then(async () => {
        const server = Date.now() - interaction.createdTimestamp;
        const uptime = (0, pretty_ms_1.default)(interaction.client.uptime);
        const api = Math.ceil(interaction.guild.shard.ping);
        await interaction.editReply(`🏓 Понг! Сервер: \`${server}ms\`, API: \`${api}ms\`, Аптайм: \`${uptime}\``);
    });
}
exports.run = run;
;
