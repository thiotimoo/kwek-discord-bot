import { commands } from "@/commands";
import specialCodes from "@/lib/special-codes";
import { Client, Interaction, Events } from "discord.js";

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction: Interaction, client: Client) {
        if (interaction.isCommand()) {
            const { commandName } = interaction;
            if (commands[commandName as keyof typeof commands]) {
                commands[commandName as keyof typeof commands].execute(
                    interaction,
                    client
                );
            }
        } else if (interaction.isModalSubmit()) {
            const codesList = specialCodes.getModalCollection();
            const result: any = codesList.get(interaction.customId);

            if (!result) return;
            result(interaction, client);
        }
    },
};
