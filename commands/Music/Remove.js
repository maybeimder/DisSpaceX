const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: ["music", "remove"],
    description: "Quita una cancion de la cocla",
    category: "Music",
    options: [
        {
            name: "position",
            description: "La posicion de la cancion que vajaquita",
            type: ApplicationCommandOptionType.Integer,
            required: true,
        }
    ],
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const tracks = interaction.options.getInteger("position");
        
        const queue = client.distube.getQueue(interaction);
        if (!queue) return interaction.editReply(`Cola limpia amiguito`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply("Pero metete a este voiceee")

        if (tracks == 0) return interaction.editReply(`[🦙] Hey tu si eres como gracios@, no ves que esa es la que está sonando`);
        if (tracks > queue.songs.length) return interaction.editReply(`[🦙] Peñoner@, esa no está en la cola`);

        const song = queue.songs[tracks];

        await queue.songs.splice(tracks, 1);

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`**Quité • [${song.name}](${song.url})** \`${song.formattedDuration}\` • ${song.user}`)

        interaction.editReply({ content: " ", embeds: [embed] });
    }
}