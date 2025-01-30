const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { Database } = require("st.db");

const GSetup = new Database("./settings/models/setup.json", { databaseInObject: true });

module.exports = async (client, queue, track) => {
  
  await client.UpdateQueueMsg(queue);
  await client.addChart(track.id);

  const db = await GSetup.get(queue.textChannel.guild.id);
  if (db.setup_enable === true) return;

  var newQueue = client.distube.getQueue(queue.id)
  var data = disspace(newQueue, track ,client)

  const nowplay = await queue.textChannel.send(data)

  const filter = (message) => {
    if (message.guild.members.me.voice.channel && message.guild.members.me.voice.channelId === message.member.voice.channelId) return true;
    else {
      message.reply({ content: "Teni que estar en el mismo canal de voz", ephemeral: true });
    }
  };
  const collector = nowplay.createMessageComponentCollector({ filter, time: 120000 });

  collector.on('collect', async (message) => {
    const id = message.customId;
    const queue = client.distube.getQueue(message.guild.id);
    if (id === "pause") {
      if (!queue) {
        collector.stop();
      }
      if (queue.paused) {
        await client.distube.resume(message.guild.id);
        const embed = new EmbedBuilder()
          .setColor("#9659c0")
          .setDescription(`\`⏯\` | **Ahi volvió la cancion: ** \`Resumed\``);

        message.reply({ embeds: [embed], ephemeral: true });
      } else {
        await client.distube.pause(message.guild.id);
        const embed = new EmbedBuilder()
          .setColor("#9659c0")
          .setDescription(`\`⏯\` | \`Pausando\``);

        message.reply({ embeds: [embed], ephemeral: true });
      }
    } else if (id === "skip") {
      if (!queue) {
        collector.stop();
      }
      if (queue.songs.length === 1 && queue.autoplay === false) {
        const embed = new EmbedBuilder()
          .setColor("#9659c0")
          .setDescription("\`🚨\` | **No hay mas** `Canciones` **En la cola**")

        message.reply({ embeds: [embed], ephemeral: true });
      } else {
        await client.distube.skip(message)
            const embed = new EmbedBuilder()
              .setColor("#9659c0")
              .setDescription("\`⏭\` | ** \`Skippeando\` ** esta")

            nowplay.edit({ components: [] });
            message.reply({ embeds: [embed], ephemeral: true });
      }
    } else if (id === "stop") {
      if (!queue) {
        collector.stop();
      }
      await client.distube.voices.leave(message.guild);
      const embed = new EmbedBuilder()
        .setDescription(`\`🚫\` | **Ahi** | \`paró\``)
        .setColor('#9659c0');

      await nowplay.edit({ components: [] });
      message.reply({ embeds: [embed], ephemeral: true });
    } else if (id === "loop") {
      if (!queue) {
        collector.stop();
      }
      if (queue.repeatMode === 0) {
        client.distube.setRepeatMode(message.guild.id, 1);
        const embed = new EmbedBuilder()
          .setColor("#9659c0")
          .setDescription(`\`🔁\` | **La canción ta en buclee:** \`Current\``)

        message.reply({ embeds: [embed], ephemeral: true });
      } else {
        client.distube.setRepeatMode(message.guild.id, 0);
        const embed = new EmbedBuilder()
          .setColor("#9659c0")
          .setDescription(`\`🔁\` | **Ya no está en bucleee:** \`Current\``)

        message.reply({ embeds: [embed], ephemeral: true });
      }
    } else if (id === "previous") {
      if (!queue) {
        collector.stop();
      }
      if (queue.previousSongs.length == 0) {
        const embed = new EmbedBuilder()
          .setColor("#9659c0")
          .setDescription("\`🚨\` | **No hay canciones** `Antes`")

        message.reply({ embeds: [embed], ephemeral: true });
      } else {
        await client.distube.previous(message)
        const embed = new EmbedBuilder()
          .setColor("#9659c0")
          .setDescription("\`⏮\` | **Hemo vuelto a la** `Anterior`")

        await nowplay.edit({ components: [] });
        message.reply({ embeds: [embed], ephemeral: true });
      }
    } else if (id === "shuffle") {
      if (!queue) {
        collector.stop();
      }
      await client.distube.shuffle(message);
      const embed = new EmbedBuilder()
          .setColor(client.color)
          .setDescription(`\`🔀\` | **Epa, canción mezclá por ahi** \`Shuffle\``);

      message.reply({ embeds: [embed], ephemeral: true });
    } else if (id === "voldown") {
      if (!queue) {
        collector.stop();
      }
      await client.distube.setVolume(message, queue.volume - 5);
      const embed = new EmbedBuilder()
          .setColor(client.color)
          .setDescription(`\`🔊\` | **Le bajo a ese toque** \`${queue.volume}\`%`)

      message.reply({ embeds: [embed], ephemeral: true });
    } else if (id === "clear") {
      if (!queue) {
        collector.stop();
      }
      await queue.songs.splice(1, queue.songs.length);
      await client.UpdateQueueMsg(queue);
      
      const embed = new EmbedBuilder()
          .setDescription(`\`📛\` | **La cola se  ha ** \`Limpiado\``)
          .setColor(client.color);

      message.reply({ embeds: [embed], ephemeral: true });
    } else if (id === "volup") {
      if (!queue) {
        collector.stop();
      }
      await client.distube.setVolume(message, queue.volume + 5);
      const embed = new EmbedBuilder()
          .setColor(client.color)
          .setDescription(`\`🔊\` | **Subiendole a la radio a ** \`${queue.volume}\`%`)

      message.reply({ embeds: [embed], ephemeral: true });
    } else if (id === "queue") {
      if (!queue) {
        collector.stop();
      }
      const pagesNum = Math.ceil(queue.songs.length / 10);
      if(pagesNum === 0) pagesNum = 1;
  
      const songStrings = [];
      for (let i = 1; i < queue.songs.length; i++) {
        const song = queue.songs[i];
        songStrings.push(
          `**${i}.** [${song.name}](${song.url}) \`[${song.formattedDuration}]\` • ${song.user}
          `);
      };

      const pages = [];
      for (let i = 0; i < pagesNum; i++) {
        const str = songStrings.slice(i * 10, i * 10 + 10).join('');
        const embed = new EmbedBuilder()
          .setAuthor({ name: `Lista de reproducción - ${message.guild.name}`, iconURL: message.guild.iconURL({ dynamic: true })})
          .setThumbnail(queue.songs[0].thumbnail || client.user.displayAvatarURL())
          .setColor(client.color)
          .setDescription(`**Ahorita ta sonando:**\n**[${queue.songs[0].name}](${queue.songs[0].url})** \`[${queue.songs[0].formattedDuration}]\` • ${queue.songs[0].user}\n\n**Va a sonar:**${str == '' ? '  Nada' : '\n' + str }`)
          .setFooter({ text: `Página • ${i + 1}/${pagesNum} | ${queue.songs.length} • Canciones | ${queue.formattedDuration} • Duración total`});
        
        pages.push(embed);
      };

      message.reply({ embeds: [pages[0]], ephemeral: true });
    }


  });
  collector.on('end', async (collected, reason) => {
    if (reason === "time") {
      nowplay.edit({ components: [] });
    }
  });
}

function disspace(nowQueue, nowTrack, client) {
  const embed = new EmbedBuilder()
    .setAuthor({ name: `Empezó a sonaaaaar...`, iconURL: 'https://cdn.discordapp.com/emojis/741605543046807626.gif' })
    .setThumbnail(nowTrack.thumbnail || client.user.displayAvatarURL())
    .setColor('#9659c0')
    .setDescription(`**[${nowTrack.name}](${nowTrack.url})**`)
    .addFields({ name: `Artista:`, value: `**[${nowTrack.uploader.name || "Anonymous"}](${nowTrack.uploader.url || ""})**`, inline: true })
    .addFields({ name: `Puesta por:`, value: `${nowTrack.user}`, inline: true })
    .addFields({ name: `Volumen Actual:`, value: `${nowQueue.volume}%`, inline: true })
    .addFields({ name: `Autoplay:`, value: `${nowQueue.autoplay ? "Activated" : "Not Active"}`, inline: true })
    .addFields({ name: `Duracion Total:`, value: `${nowQueue.formattedDuration}`, inline: true })
    .setTimestamp()

  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
      .setCustomId("stop")
      .setLabel(`Quitar`)
      .setEmoji("✖")
      .setStyle(ButtonStyle.Primary)
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId("previous")
        .setLabel(`Anterior`)
        .setEmoji("⬅")
        .setStyle(ButtonStyle.Primary)
    )
    .addComponents(
      new ButtonBuilder()
      .setCustomId("pause")
      .setLabel(`Pausar`)
      .setEmoji("⏯")
      .setStyle(ButtonStyle.Danger)
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId("skip")
        .setLabel(`Saltar`)
        .setEmoji("➡")
        .setStyle(ButtonStyle.Primary)
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId("loop")
        .setLabel(`Loop`)
        .setEmoji("🔄")
        .setStyle(ButtonStyle.Success)
    )

    const row2 = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId("shuffle")
        .setLabel(`Shuffle`)
        .setEmoji(`🔀`)
        .setStyle(ButtonStyle.Primary)
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId("voldown")
        .setLabel(`Vol -`)
        .setEmoji(`🔉`)
        .setStyle(ButtonStyle.Success)
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId("clear")
        .setLabel(`Limpiar`)
        .setEmoji(`🗑`)
        .setStyle(ButtonStyle.Secondary)
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId("volup")
        .setLabel(`Vol +`)
        .setEmoji(`🔊`)
        .setStyle(ButtonStyle.Success)
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId("queue")
        .setLabel(`Cola`)
        .setEmoji(`📋`)
        .setStyle(ButtonStyle.Primary)
    )

  return {
    embeds: [embed],
    components: [row, row2]
  }
}