const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: ["music", "autoplay"],
    description: "Se reproduce algo solo",
    category: "Music",
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });
        
        const queue = client.distube.getQueue(interaction);
        if (!queue) return interaction.editReply(`[🦙] No hay na en la cola`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply("Teni que estar en el mismo canal de vo")

        if (!queue.autoplay) {
            await client.distube.toggleAutoplay(interaction);
    
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`\`📻\` | *Autoplay* \`Activated\``);

            interaction.editReply({ embeds: [embed] });
        } else {
            await client.distube.toggleAutoplay(interaction);

            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`\`📻\` | *Autoplay* \`Deactivated\``);

            interaction.editReply({ embeds: [embed] });
        }
    }
}
