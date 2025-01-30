const { EmbedBuilder } = require("discord.js");

module.exports = async (client, queue) => {
    await client.UpdateMusic(queue);

    const embed = new EmbedBuilder()
        .setColor('#9659c0')
        .setDescription(`**Canal soooooolo**`)

    queue.textChannel.send({ embeds: [embed] })
}