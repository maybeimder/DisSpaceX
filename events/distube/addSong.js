const { EmbedBuilder } = require("discord.js");
const { Database } = require("st.db");

const GMessage = new Database("./settings/models/message.json", { databaseInObject: true });
const GSetup = new Database("./settings/models/setup.json", { databaseInObject: true });

module.exports = async (client, queue, song) => {
    const db = await GSetup.get(queue.textChannel.guild.id);
    if (db.setup_enable === true) return;

    const data = await GMessage.get(queue.textChannel.guild.id);
    const msg = await queue.textChannel.messages.cache.get(data.message_id);

    const embed = new EmbedBuilder()
        .setDescription(`**Agregá a la cola • [${song.name || "Anonymous"}](${song.url || ""})** \`${song.formattedDuration}\` • ${song.user}`)
        .setColor('#9659c0')

    await msg.edit({ content: " ", embeds: [embed] })
}