import { config } from "@/config";
import { Message, Events, Client } from "discord.js";
import customEval from"@/lib/custom-eval";
import { deployCommands } from "@/deploy-commands";

const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
module.exports = {
    name: Events.MessageCreate,
    async execute(message: Message, client: Client) {
        const prefixRegex = new RegExp(
            `^(<@!?${client.user?.id}>|${escapeRegex(
                config.DEFAULT_PREFIX || ""
            )})\\s*`
        );
        if (!prefixRegex.test(message.content)) return;
        const [, matchedPrefix]: any = message.content.match(prefixRegex);
        const args = message.content
            .slice(matchedPrefix.length)
            .trim()
            .split(/ +/);
        const commandName = args.shift()?.toLowerCase();
        if (message.author.id === client.user?.id) return;
        if (commandName == "eval") {
            if (message.author.id !== "1032948429392982067") return;
            try {
                const result = await customEval(args.join(" "));
                return message.channel.send(`\`\`\`js\n${result}\n\`\`\``);
            } catch (err: any) {
                message.channel.send(
                    `\`ERROR\` \`\`\`xl\n${err.stack.toString()}\n\`\`\``
                );
            }
        } else if (commandName == "reload") {
            if (message.author.id !== "1032948429392982067") return;
            if (!message.guild) return;
            await deployCommands({ guildId: message.guild.id });
            message.reply('Commands (/) reloaded!')
        }
    },
};
