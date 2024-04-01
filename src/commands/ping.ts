import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
.setName('ping')
.setDescription('Replies with Pong! 🏓')

export async function execute(interaction: CommandInteraction) {
    return interaction.reply('Pong! 🏓')
}