const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: ["music", "pause"],
    description: "Páralo pue",
    category: "Music",
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const queue = client.distube.getQueue(interaction);
        if (!queue) return interaction.editReply(`[🦙] No hay na en la cola`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply("Teni que estar en el mismo canal de vo")
		
		if (queue.paused) { 
            await client.distube.resume(interaction);

			const embed = new EmbedBuilder()
				.setColor(client.color)
				.setDescription(`\`⏯\` | **[🦙] Bueno,  que vuelva la musica ** \`Resumed\``);

			interaction.editReply({ embeds: [embed] });
            await client.UpdateQueueMsg(queue);
		} else {
			await client.distube.pause(interaction);

			const embed = new EmbedBuilder()
				.setColor(client.color)
                .setDescription(`\`⏯\` | **[🦙] Pausao pue ** \`Paused\``);

			interaction.editReply({ embeds: [embed] });
            await client.UpdateQueueMsg(queue);
		}
    }
}
