const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: ["music", "leave"],
    description: "Dime de donde salirme",
    category: "Music",
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const queue = client.distube.getQueue(interaction);
        if (!queue) return interaction.editReply(`[🦙] No hay na en la cola`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply("Teni que estar en el mismo canal de vo")

        await client.distube.voices.leave(interaction.guild);

        const embed = new EmbedBuilder()
            .setDescription(`\`🚫\` | **[🦙] La despego de :** | \`${channel.name}\``)
            .setColor(client.color)

        interaction.editReply({ embeds : [embed] });
    }
}
