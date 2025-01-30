const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: ["music", "skipto"],
    description: "Salta a una posicion en especifico",
    category: "Music",
    options: [
        {
            name: "position",
            description: "La posicion en la cola",
            type: ApplicationCommandOptionType.Integer,
            required: true,
        }
    ],
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const args = interaction.options.getInteger("position");

        const queue = client.distube.getQueue(interaction);
        if (!queue) return interaction.editReply(`[🦙] No hay na en la cola`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply("Teni que estar en el mismo canal de vo")

        if ((args > queue.songs.length) || (args && !queue.songs[args])) return interaction.editReply("Canción no encontrada");

        await client.distube.jump(interaction, args)
        
        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`\`⏭\` | **[🦙] Saltado hasta:** ${args}`)

        interaction.editReply({ embeds: [embed] });
    }
}
