import { deployCommands } from "@/deploy-commands";
import { Client, Guild, Events } from "discord.js";
module.exports = {
    name: Events.GuildCreate,
    async execute(guild: Guild, client: Client) {
        console.log(guild.id);
        await deployCommands({ guildId: guild.id });
    },
};
