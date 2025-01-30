const { EmbedBuilder } = require('discord.js');

module.exports = { 
    name: ["music", "shuffle"],
    description: "Baraja la cola",
    category: "Music",
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const queue = client.distube.getQueue(interaction);
        if (!queue) return interaction.editReply(`[🦙] No hay na en la cola`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply("Teni que estar en el mismo canal de vo")

        await client.distube.shuffle(interaction);

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`\`🔀\` | **La cancion ha sido mezclada por ahi:** \`Shuffle\``);

        interaction.editReply({ embeds: [embed] });
    }
};