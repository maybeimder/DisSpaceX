const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: ["music", "join"],
    description: "Me meto en el canal de voz en el que estés",
    category: "Music",
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

		const queue = client.distube.getQueue(interaction);
		if (queue) return interaction.editReply(`[🦙] Mano toi ocupao en otro canal`);
		const { channel } = interaction.member.voice;
		if(!channel) return interaction.editReply(`[🦙] Primero metete tu a un canal de voz, no? geni@`);

		await client.distube.voices.join(interaction.member.voice.channel);

		const embed = new EmbedBuilder()
			.setColor(client.color)
			.setDescription(`\`🔊\` | **[🦙] Pa que soy bueno? ando en ** \`${channel.name}\``)

		interaction.editReply({ embeds: [embed] });
    }
}
