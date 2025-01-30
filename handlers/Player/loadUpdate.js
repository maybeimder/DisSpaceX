const { EmbedBuilder } = require("discord.js");
const { Database } = require("st.db");

const db = new Database("./settings/models/setup.json", { databaseInObject: true });

module.exports = async (client) => {

    client.UpdateQueueMsg = async function (queue) {
        const CheckDB = await db.has(queue.textChannel.guild.id);
        if(!CheckDB) return;

        const data = await db.get(queue.textChannel.guild.id);
        if (data.setup_enable === false) return;

        const channel = await client.channels.cache.get(data.setup_ch);
        if (!channel) return;

        const playMsg = await channel.messages.fetch(data.setup_msg, { cache: false, force: true });
        if (!playMsg) return;

        const songStrings = [];
        const queuedSongs = queue.songs.map((song, i) => `*\`${i + 1} • ${song.name} • [${song.formattedDuration}]\`* • \`${song.user.tag}\``);

        songStrings.push(...queuedSongs);

        const Str = songStrings.slice(0, 10).join('\n');

        const cSong = queue.songs[0];

        const played = queue.playing ? `Empieza a sonar...` : `Canción pausada`;

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${played}`, iconURL: "https://cdn.discordapp.com/emojis/741605543046807626.gif" })
            .setDescription(`[${cSong.name}](${cSong.url}) \`[${cSong.formattedDuration}]\` • ${cSong.user}`) // [${cSong.title}](${cSong.uri}) \`[${formatDuration(cSong.duration)}]\` • ${cSong.requester}
            .setColor(client.color)
            .setImage(`https://img.youtube.com/vi/${cSong.id}/sddefault.jpg`)
            .setFooter({ text: `${queue.songs.length} • Canciones en cola | Volumen • ${queue.volume}% | ${queue.formattedDuration} • Duración Total` }) //${queue.queue.length} • Song's in Queue | Volume • ${queue.volume}% | ${qDuration} • Total Duration

        return playMsg.edit({ 
            content: `**__Lista de reproducción:__**\n${Str == '' ? `Entra a un canal de voz y busca cancicones` : '\n' + Str}`, 
            embeds: [embed],
            components: [client.enSwitch, client.enSwitch2] 
        }).catch((e) => {});
    };

    client.UpdateMusic = async function (queue) {
        const CheckDB = await db.has(queue.textChannel.guild.id);
        if(!CheckDB) return;

        const data = await db.get(queue.textChannel.guild.id);

        if (data.setup_enable === false) return;

        const channel = await client.channels.cache.get(data.setup_ch);
        if (!channel) return;

        const playMsg = await channel.messages.fetch(data.setup_msg, { cache: false, force: true });
        if (!playMsg) return;

        const queueMsg = `**__Lista de reproducción:__**\n${Str == '' ? `Entra a un canal de voz y busca cancicones` : '\n' + Str}`;

        const playEmbed = new EmbedBuilder()
          .setColor(client.color)
          .setAuthor({ name: `No hay canciones sonando ahora mismo` })
          .setImage(`https://cdn.discordapp.com/attachments/1327447331645292555/1328905608749121556/banner.png?ex=6788674a&is=678715ca&hm=9e5401ab3de892c85459b1c4fe4fec8189edec7f02647c3cc02cee881ca7a409&`)
          .setDescription(`>>> [Invite](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=2184310032&scope=bot%20applications.commands) | [Support](https://discord.gg/SNG3dh3MbR) | [Website](https://adivise.github.io/Stylish/)`)
          .setFooter({ text: `Prefijo es: /` });

        return playMsg.edit({ 
            content: `${queueMsg}`, 
            embeds: [playEmbed], 
            components: [client.diSwitch, client.diSwitch2] 
        }).catch((e) => {});
    };
};