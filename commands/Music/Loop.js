const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: ["music", "loop"],
    description: "Que se repitaaaa",
    category: "Music",
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });
        
        const queue = client.distube.getQueue(interaction);
        if (!queue) return interaction.editReply(`[🦙] No hay na en la cola`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply("Teni que estar en el mismo canal de vo")

        if (queue.repeatMode === 0) {
            await client.distube.setRepeatMode(interaction, 1);
            
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`\`🔁\` | **[🦙] Esta es buenisima, ahi va otra vez :** \`Current\``)

            interaction.editReply({ embeds: [embed] });
        } else {
            await client.distube.setRepeatMode(interaction, 0);

            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`\`🔁\` | **[🦙] Bueno ya mucho, le quitamo el loop :** \`Current\``)

            interaction.editReply({ embeds: [embed] });
        }
    }
}
