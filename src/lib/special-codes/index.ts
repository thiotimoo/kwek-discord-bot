import path from "path";
import fs from "fs";
import { Client, Collection, Interaction } from "discord.js";

const modalCollection = new Collection();
const codesCollection = new Collection();
const codesPath = path.join(__dirname);
const codeFiles = fs
    .readdirSync(codesPath)
    .filter(
        (file) =>
            (file.endsWith("js") || file.endsWith("ts")) && file != "index.ts"
    );

for (const file of codeFiles) {
    const filePath = path.join(codesPath, file);
    const result = require(filePath);
    codesCollection.set(
        result.name,
        (interaction: Interaction, client: Client) =>
            result.execute(interaction, client)
    );
    if (result.modal)
        modalCollection.set(
            result.name,
            (interaction: Interaction, client: Client) =>
                result.callback(interaction, client)
        );
}

const getCodesCollection = () => {
    return codesCollection;
};

const getModalCollection = () => {
    return modalCollection;
};

export default {getCodesCollection, getModalCollection};