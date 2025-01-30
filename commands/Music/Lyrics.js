const lyricsfinder = require('lyrics-finder');
const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = { 
    name: ["music", "lyric"],
    description: "Saca tus dotes de cantautor, yo te doy la letra",
    category: "Music",
    options: [
        {
            name: "song",
            description: "Que cancion te busco la letra?",
            type: ApplicationCommandOptionType.String,
            required: false,
        }
    ],
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        let song = interaction.options.getString("song");

        const queue = client.distube.getQueue(interaction);
        if (!queue) return interaction.editReply(`[🦙] No hay na en la cola`);

        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) {
            return interaction.editReply("Teni que estar en el mismo canal de vo");
        }

        let csong = queue.songs[0];
        if (!song && csong) song = csong.name;

        let lyrics = null;

        try {
            lyrics = await lyricsfinder(song, "");
            if (!lyrics) {
                return interaction.editReply("[🦙] Me vas a disculpar pero yo no encontré ninguna letra de sa canción");
            }
        } catch (err) {
            console.log(err);
            return interaction.editReply("[🦙] Me vas a disculpar pero yo no encontré ninguna letra de sa canción");
        }

        let lyricsEmbed = new EmbedBuilder()
            .setColor(client.color)
            .setTitle(`Lyrics`)
            .setDescription(`**${song}**\n${lyrics}`)
            .setFooter({ text: `Requested by ${interaction.user.username}` })
            .setTimestamp();

        if (lyrics.length > 2048) {
            lyricsEmbed.setDescription("[🦙] Joaa y esa vaina que? documental, no me alcanza el mensaje");
        }

        const msg = await interaction.editReply({ embeds: [lyricsEmbed] });

        var total = queue.songs[0].duration * 1000;
        var current = queue.currentTime * 1000;
        let time = total - current;

        setTimeout(() => { 
            msg.delete().catch(console.error); 
        }, time);
    }
};
