import {
    ActionRowBuilder,
    Client,
    CommandInteraction,
    ModalSubmitInteraction,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    AttachmentBuilder,
    EmbedBuilder,
} from "discord.js";
import { createCanvas, loadImage } from "@napi-rs/canvas";
import fs from "fs";

module.exports = {
    name: "garis",
    modal: true,
    async callback(interaction: ModalSubmitInteraction, client: Client) {
        const x1 = parseFloat(interaction.fields.getTextInputValue("x1"));
        const y1 = parseFloat(interaction.fields.getTextInputValue("y1"));
        const x2 = parseFloat(interaction.fields.getTextInputValue("x2"));
        const y2 = parseFloat(interaction.fields.getTextInputValue("y2"));
        const scale = parseFloat(
            interaction.fields.getTextInputValue("scale") || "20"
        );
        const m = (y2 - y1) / (x2 - x1);
        const c = y1 - m * x1;
        const intersectXAxis = { x: -c / m, y: 0, color: "#ff0000" };
        const intersectYAxis = { x: 0, y: c, color: "#ff0000" };
        const points = [
            { x: x1, y: y1, color: "#ffffff" },
            { x: x2, y: y2, color: "#ffffff" },
        ];

        let message = "";
        message += `> X₁ = **${x1}**, Y₁ = **${y1}**\n> X₂ = **${x2}**, Y₂ = **${y2}**`;
        message += `\n\n> m = (y2-y1) / (x2-x1)\n> = (**${y2}** - **${y1}**) / (**${x2}** - **${x1}**)\n> =${m}`;
        message += `\n\n> Perpotongan Sumbu-X: (${intersectXAxis.x},0)`;
        message += `\n> Perpotongan Sumbu-Y: (0,${intersectYAxis.y})`;
        message += `\n\n> Scale: ${scale}`;
        const embed = new EmbedBuilder()
            .setTitle("Garis Linear")
            .setDescription(message)
            .setImage("attachment://graph-image.png");
        interaction.reply({
            embeds: [embed],
            files: [await drawGraph(points, m, c, scale)],
        });
    },
    async execute(interaction: CommandInteraction, client: Client) {
        console.log(`${this.name}`);
        const modal = new ModalBuilder()
            .setCustomId(`${this.name}`)
            .setTitle("Garis Linear");

        const xFirstInput = new TextInputBuilder()
            .setCustomId("x1")
            .setLabel("X₁")
            .setStyle(TextInputStyle.Short);
        const yFirstInput = new TextInputBuilder()
            .setCustomId("y1")
            .setLabel("Y₁")
            .setStyle(TextInputStyle.Short);

        const xSecondInput = new TextInputBuilder()
            .setCustomId("x2")
            .setLabel("X₂")
            .setStyle(TextInputStyle.Short);
        const ySecondInput = new TextInputBuilder()
            .setCustomId("y2")
            .setLabel("Y₂")
            .setStyle(TextInputStyle.Short);
        const scaleInput = new TextInputBuilder()
            .setCustomId("scale")
            .setLabel("Scale")
            .setPlaceholder("Default: 20")
            .setRequired(false)
            .setStyle(TextInputStyle.Short);

        const xFirstActionRow =
            new ActionRowBuilder<TextInputBuilder>().addComponents(xFirstInput);
        const yFirstActionRow =
            new ActionRowBuilder<TextInputBuilder>().addComponents(yFirstInput);
        const xSecondActionRow =
            new ActionRowBuilder<TextInputBuilder>().addComponents(
                xSecondInput
            );
        const ySecondActionRow =
            new ActionRowBuilder<TextInputBuilder>().addComponents(
                ySecondInput
            );
        const scaleActionRow =
            new ActionRowBuilder<TextInputBuilder>().addComponents(scaleInput);
        modal.addComponents(
            xFirstActionRow,
            yFirstActionRow,
            xSecondActionRow,
            ySecondActionRow,
            scaleActionRow
        );
        await interaction.showModal(modal);
    },
};

async function drawGraph(points: any, m: number, c: number, scale: number) {
    const width = 800;
    const height = 600;

    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");

    function mapCoordinate(x: number, y: number) {
        const centerX = width / 2;
        const centerY = height / 2;

        const canvasX = centerX + x * scale;
        const canvasY = centerY - y * scale; // Negatif untuk membalik grafiknya

        return { x: canvasX, y: canvasY };
    }

    // Draw x and y axes
    context.strokeStyle = "#FFFFFF";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(0, height / 2);
    context.lineTo(width, height / 2);
    context.moveTo(width / 2, 0);
    context.lineTo(width / 2, height);
    context.closePath();
    context.stroke();

    // Draw the grid
    const gap = 5 * scale;
    context.strokeStyle = "#FFFFFF";
    context.globalAlpha = 0.2;
    context.lineWidth = 2;
    context.beginPath();
    for (let x = 0; x < width / 2; x++) {
        x += gap;
        context.moveTo(width / 2 + x, 0);
        context.lineTo(width / 2 + x, height);
        context.moveTo(width / 2 - x, 0);
        context.lineTo(width / 2 - x, height);
    }
    for (let y = 0; y < height / 2; y++) {
        y += gap;
        context.moveTo(0, height / 2 + y);
        context.lineTo(width, height / 2 + y);
        context.moveTo(0, height / 2 - y);
        context.lineTo(width, height / 2 - y);
    }
    context.stroke();
    context.closePath();
    context.globalAlpha = 1;

    // Draw the linear equation
    context.strokeStyle = "#f00000";
    context.lineWidth = 5;
    context.beginPath();
    for (let x = -width / 2; x <= width / 2; x += 0.1) {
        const y = m * x + c;
        const { x: canvasX, y: canvasY } = mapCoordinate(x, y);
        if (x === -width / 2) {
            context.moveTo(canvasX, canvasY);
        } else {
            context.lineTo(canvasX, canvasY);
        }
    }
    context.closePath();
    context.stroke();

    // Draw the point line
    context.strokeStyle = "#0000f0";
    context.beginPath();
    for (let i = 0; i < points.length; i++) {
        const { x: canvasX, y: canvasY } = mapCoordinate(
            points[i].x,
            points[i].y
        );
        if (i === points.length - 1) {
            context.lineTo(canvasX, canvasY);
        } else {
            context.moveTo(canvasX, canvasY);
        }
    }
    context.closePath();
    context.stroke();

    // Draw the points
    const intersectXAxis = { x: -c / m, y: 0, color: "#ff0000" };
    const intersectYAxis = { x: 0, y: c, color: "#ff0000" };
    points.push(intersectXAxis);
    points.push(intersectYAxis);
    for (let i = 0; i < points.length; i++) {
        const { x: canvasX, y: canvasY } = mapCoordinate(
            points[i].x,
            points[i].y
        );
        context.fillStyle = points[i].color;
        context.beginPath();
        context.arc(canvasX, canvasY, 10, 0, 2 * Math.PI);
        context.closePath();
        context.fill();
    }

    const attachment = new AttachmentBuilder(await canvas.encode("png"), {
        name: "graph-image.png",
    });
    return attachment;
}
