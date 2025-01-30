const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: ["music", "seek"],
    description: "Busca un segundo en especifico de alguna cancion",
    category: "Music",
    options: [
        {
            name: "seconds",
            description: "Cuantos seg pue",
            type: ApplicationCommandOptionType.Integer,
            required: true,
        }
    ],
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });
        
        const value = interaction.options.getInteger("seconds");
        
        const queue = client.distube.getQueue(interaction);
        if (!queue) return interaction.editReply(`[🦙] No hay na en la cola`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply("Teni que estar en el mismo canal de vo")

        if(value >= queue.songs[0].duration || value < 0) return interaction.editReply(`No puede ser mas largo que lo que dura la cancion pue, respete`);

        await queue.seek(value);

        const embed = new EmbedBuilder()
            .setDescription(`\`⏭\` | *Adelantado:* \`${value}\`seg`)
            .setColor(client.color);

        interaction.editReply({ embeds: [embed] });
    }
}