"use strict";
const discord_js_1 = require("discord.js");
module.exports = async (interaction) => {
    if (interaction.message.type == discord_js_1.MessageType.ChatInputCommand) {
        if (interaction.user.id != interaction.message.interaction.user.id) {
            return await interaction.reply({ content: "❌ Вы не можете использовать это.", ephemeral: true });
        }
        ;
    }
    ;
    if (interaction.customId == "reply:delete") {
        let msg = interaction.message;
        return msg.delete();
    }
    ;
};
