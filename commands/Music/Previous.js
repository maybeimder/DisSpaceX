const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: ["music", "previous"],
    description: "Reproducir la que estaba antes",
    category: "Music",
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const queue = client.distube.getQueue(interaction);
        if (!queue) return interaction.editReply(`No hay nada en la cola ahora mismo`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply("[🦙] Métete en el mismo canal que yo y te creo")

        if (queue.previousSongs.length == 0) {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription("\`🚨\` | **No hay mas canciones ** `Previous`")

            interaction.editReply({ embeds: [embed] });
        } else { 
            await client.distube.previous(interaction);

            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription("\`⏮\` | **[🦙] Pues nada, volvimo a esta:** `Previous`")

            interaction.editReply({ embeds: [embed] });
        }        
    }
}
