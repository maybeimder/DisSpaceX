const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: ["music", "volume"],
    description: "Subeme la radio",
    category: "Music",
    options: [
        {
            name: "amount",
            description: "Cuanto de volumen",
            type: ApplicationCommandOptionType.Integer,
            required: false,
        }
    ],
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const volume = interaction.options.getInteger("amount");

        const queue = client.distube.getQueue(interaction);
        if (!queue) return interaction.editReply(`[🦙] No hay na en la cola`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply("Teni que estar en el mismo canal de vo")

        if (!volume) {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`Volumen actual: **volume** : \`${queue.volume}\`%`)

            return interaction.editReply({ embeds: [embed] });
        }

        if (volume < 1 || volume > 100) return interaction.editReply(`[🦙] Hey hey, es entre 1 y 100`)

        await client.distube.setVolume(interaction, volume);

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`\`🔊\` | **Cambié el volumen a:** \`${volume}\`%`)

        interaction.editReply({ embeds: [embed] });
    }
}
