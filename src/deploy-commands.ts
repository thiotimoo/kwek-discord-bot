import { REST, Routes } from "discord.js";
import { commands } from "@/commands";
import { config } from "@/config";

const commandData = Object.values(commands).map((command) => command.data);
const rest = new REST({ version: "10" }).setToken(config.DISCORD_TOKEN);

type DeployCommandsProps = {
    guildId: string;
};

export async function deployCommands({ guildId }: DeployCommandsProps) {
    try {
        console.log("Starting refreshing application (/) commands.");
        await rest.put(
            Routes.applicationGuildCommands(config.DISCORD_CLIENT_ID, guildId),
            {
                body: commandData,
            }
        );
        console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
        console.error(error);
    }
}
