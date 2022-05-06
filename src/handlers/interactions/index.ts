import { Interaction } from "discord.js";
import buttons = require("./buttons");
import handleCommand from "./commands";

//has stolen from https://github.com/itzJOHv/djohbot

export = (interaction: Interaction) => {
    if (
        !interaction.guild ||
        !interaction.isCommand() &&
        !interaction.isButton()
    ) return;

    if (interaction.isCommand()) return handleCommand(interaction as any);
    if (interaction.isButton()) return buttons(interaction);
};

