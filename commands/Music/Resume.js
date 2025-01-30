const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: ["music", "resume"],
    description: "Quitale la pausa a la canciooon",
    category: "Music",
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const queue = client.distube.getQueue(interaction);
        if (!queue) return interaction.editReply(`No hay na en la cola`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply("Metete al voiceee")
		
		if (queue.paused) { 
			await client.distube.resume(interaction);

			const embed = new EmbedBuilder()
				.setColor(client.color)
				.setDescription(`\`⏯\` | **Ahi va de vueltaa:** \`Resumed\``);

			interaction.editReply({ embeds: [embed] });
			client.UpdateQueueMsg(queue);
		} else {
			await client.distube.pause(interaction);

			const embed = new EmbedBuilder()
				.setColor(client.color)
				.setDescription(`\`⏯\` | **Bueno, detenida un poquito:** \`Paused\``);

			interaction.editReply({ embeds: [embed] });
			client.UpdateQueueMsg(queue);
		}
    }
}
