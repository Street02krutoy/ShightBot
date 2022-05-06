"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const buttons = require("./buttons");
const commands_1 = __importDefault(require("./commands"));
module.exports = (interaction) => {
    if (!interaction.guild ||
        !interaction.isCommand() &&
            !interaction.isButton())
        return;
    if (interaction.isCommand())
        return (0, commands_1.default)(interaction);
    if (interaction.isButton())
        return buttons(interaction);
};
