import specialCodes from "@/lib/special-codes";
import {
    ActionRowBuilder,
    Client,
    CommandInteraction,
    ModalBuilder,
    SlashCommandBuilder,
    TextInputBuilder,
    TextInputStyle,
} from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("code")
    .addStringOption((option) =>
        option
            .setName("string")
            .setDescription("Special code")
            .setRequired(true)
    )
    .setDescription("I'm feeling lucky");

export async function execute(interaction: CommandInteraction, client: Client) {
    const code = interaction.options.get("string")?.value;
    const codesList = specialCodes.getCodesCollection();
    const result:any = codesList.get(code);

    if (!result) return interaction.reply('Invalid code.');
    result(interaction, client);
}
