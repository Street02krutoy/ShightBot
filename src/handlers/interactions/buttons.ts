import { ButtonInteraction, Message, MessageType } from "discord.js";

//has stolen from https://github.com/itzJOHv/djohbot

export = async (interaction: ButtonInteraction) => {
    if (interaction.message.type == MessageType.ChatInputCommand) {
        if (interaction.user.id != interaction.message.interaction.user.id) {
            return await interaction.reply({ content: "❌ Вы не можете использовать это.", ephemeral: true });
        };
    };


    if (interaction.customId == "reply:delete") {
        let msg: Message = interaction.message as Message;
        return msg.delete();
    };
};