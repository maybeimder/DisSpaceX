const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: ["music", "replay"],
    description: "Vuelve a escuchar esta misma, por si te encanta",
    category: "Music",
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const queue = client.distube.getQueue(interaction);
        if (!queue) return interaction.editReply(`No hay na en la cola ahora mismo`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply("Teni que estar en el mismo voice chaat")

        await queue.seek(0)

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setDescription("\`🔁\` | **[🦙] Ahi va otra vez:** `Replay`")

        interaction.editReply({ embeds: [embed] });
        
    }
}
