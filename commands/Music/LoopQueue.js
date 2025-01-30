const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: ["music", "loopqueue"],
    description: "Repite toa la playlist ps",
    category: "Music",
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const queue = client.distube.getQueue(interaction);
        if (!queue) return interaction.editReply(`[🦙] No hay na en la cola`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply("Teni que estar en el mismo canal de vo")

        if (queue.repeatMode === 2) {
            await client.distube.setRepeatMode(interaction, 0);

            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`\`🔁\` | **[🦙] Que voa repetir yo sa vaina:** \`All\``)

            interaction.editReply({ embeds: [embed] });
        } else {
            await client.distube.setRepeatMode(interaction, 2);
            
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`\`🔁\` | **[🦙] Bueno, vamo a ponerla otra ve:** \`All\``)

            interaction.editReply({ embeds: [embed] });
        }
    }
}
