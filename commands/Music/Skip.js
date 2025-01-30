const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: ["music", "skip"],
    description: "Salta la cancion actual pue",
    category: "Music",
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const queue = client.distube.getQueue(interaction);
        if (!queue) return interaction.editReply(`[🦙] No hay na en la cola`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply("Teni que estar en el mismo canal de vo")

        if (queue.songs.length === 1 && queue.autoplay === false) {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription("\`🚨\` | **No hay** `Songs` **en la colaa**")

            interaction.editReply({ embeds: [embed] });
        } else { 
            await client.distube.skip(interaction);
            
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription("\`⏭\` | **La canción ha sido ** `Skipped`")

            interaction.editReply({ embeds: [embed] });
        }
    }
}