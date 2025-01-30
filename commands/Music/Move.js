const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: ["music", "move"],
    description: "Reacomoda la lista de reproduccion",
    category: "Music",
    options: [
        {
            name: "queue",
            description: "El numerito de la cancion",
            type: ApplicationCommandOptionType.Integer,
            required: true,
        },
        {
            name: "position",
            description: "A que posicion",
            type: ApplicationCommandOptionType.Integer,
            required: true,
        }
    ],
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const tracks = interaction.options.getInteger("queue");
        const position = interaction.options.getInteger("position");

        const queue = client.distube.getQueue(interaction);
        if (!queue) return interaction.editReply(`[🦙] No hay na en la cola`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply("Teni que estar en el mismo canal de vo")

        if (tracks == 0) return interaction.editReply(`[🦙] Mandas cáscara, esa ya está sonando`);
        if (position == 0) return interaction.editReply(`[🦙] Mandas cáscara, esa ya está sonando`);
        if (tracks > queue.songs.length) return interaction.editReply(`[🦙] No vi esa canción en la cola`);
        if (position > queue.songs.length) return interaction.editReply(`[🦙] No la puedo poner en esa posicion`);

        const song = queue.songs[tracks];

        await queue.songs.splice(tracks);
        await queue.addToQueue(song, position);

        const embed = new EmbedBuilder()
            .setDescription(`**Se moviió • [${song.name}](${song.url})** a ${position}`)
            .setColor(client.color)

        interaction.editReply({ embeds: [embed] });
    }
}