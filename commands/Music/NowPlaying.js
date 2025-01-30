const { EmbedBuilder } = require("discord.js");
const { Database } = require("st.db");

const GSetup = new Database("./settings/models/setup.json", { databaseInObject: true });

module.exports = {
    name: ["nowplaying"],
    description: "Muestra la cancion de ahora",
    category: "Music",
    run: async (client, interaction) => {
		await interaction.deferReply({ ephemeral: false });

        const db = await GSetup.get(interaction.guild.id);
        if (db.setup_enable === true) return interaction.editReply("Como llegaste hasta aca?");

        const queue = client.distube.getQueue(interaction);
        if (!queue) return interaction.editReply(`[🦙] No hay na en la cola`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply("Teni que estar en el mismo canal de vo")

        const uni = `${queue.songs[0].playing ? '⏸️ |' : '🔴 |'}`;
        const part = Math.floor((queue.currentTime / queue.songs[0].duration) * 30);

        const embed = new EmbedBuilder()
            .setAuthor({ name: queue.songs[0].playing ? 'Pausar canción' : 'Reproduciendo: ', iconURL: "https://cdn.discordapp.com/emojis/741605543046807626.gif"})
            .setColor(client.color)
            .setDescription(`**[${queue.songs[0].name}](${queue.songs[0].url})**`)
            .setThumbnail(`${queue.songs[0].thumbnail || client.user.displayAvatarURL()}`)
            .addFields({ name: 'Artista:', value: `[${queue.songs[0].uploader.name || "Anonymous"}](${queue.songs[0].uploader.url || ""})`, inline: true })
            .addFields({ name: 'Pedido por:', value: `${queue.songs[0].user}`, inline: true })
            .addFields({ name: 'Volumen:', value: `${queue.volume}%`, inline: true })
            .addFields({ name: 'Vistas', value: `${queue.songs[0].views || "0"}`, inline: true })
            .addFields({ name: 'Likes:', value: `${queue.songs[0].likes || "0"}`, inline: true })
            .addFields({ name: 'Filtros:', value: `${queue.filters.names.join(', ') || "Normal"}`, inline: true })
            .setTimestamp()
            if (!part == "Infinity") {
                embed.addFields({ name: `Duración: \`[${queue.formattedCurrentTime} / ${queue.songs[0].formattedDuration}]\``, value: `\`\`\`${uni} ${'─'.repeat(part) + '🎶' + '─'.repeat(30 - part)}\`\`\``, inline: false })
            } else {
                embed.addFields({ name: `Duración: \`[0:00 / ${queue.songs[0].formattedDuration}]\``, value:`\`\`\`🔴 | 🎶──────────────────────────────\`\`\``, inline: false })
            }
        interaction.editReply({ embeds: [embed] });
    }
}
