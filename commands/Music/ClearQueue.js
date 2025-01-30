const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: ["music", "clearqueue"],
    description: "Pa limpiar la cola pue",
    category: "Music",
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });
        
        const queue = client.distube.getQueue(interaction);
        if (!queue) return interaction.editReply(`[🦙] No hay na en la cola`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply("Teni que estar en el mismo canal de vo")

        await queue.songs.splice(1, queue.songs.length);
        await client.UpdateQueueMsg(queue);
        
        const embed = new EmbedBuilder()
            .setDescription(`\`📛\` | *[🦙] Se acabó la cola pue:* \`Cleared\``)
            .setColor(client.color);

        interaction.editReply({ embeds: [embed] });
    }
}
