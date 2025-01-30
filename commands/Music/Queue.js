const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const { QueuePage } = require('../../structures/PageQueue.js');

module.exports = {
    name: ["queue"],
    description: "Muestra la cola de reproducción",
    category: "Music",
    options: [
        {
            name: "page",
            description: "Página?",
            type: ApplicationCommandOptionType.Integer,
            required: false,
        }
    ],
    run: async (client, interaction) => {
		await interaction.deferReply({ ephemeral: false });

		const args = interaction.options.getInteger("page");

        const queue = client.distube.getQueue(interaction);
        if (!queue) return interaction.editReply(`[🦙] jeje, cola limpia, jeje `);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply("[🦙] Venite a un canal de voz")

		const pagesNum = Math.ceil(queue.songs.length / 10);
		if(pagesNum === 0) pagesNum = 1;

		const songStrings = [];
		for (let i = 1; i < queue.songs.length; i++) {
			const song = queue.songs[i];
			songStrings.push(
				`**${i}.** [${song.name}](${song.url}) \`[${song.formattedDuration}]\` • ${song.user}
				`);
		}

		const pages = [];
		for (let i = 0; i < pagesNum; i++) {
			const str = songStrings.slice(i * 10, i * 10 + 10).join('');
			const embed = new EmbedBuilder()
                .setAuthor({ name: `Cola de reproduccion - ${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true })})
                .setThumbnail(queue.songs[0].thumbnail)
				.setColor(client.color)
				.setDescription(`**Ta sonando:**\n**[${queue.songs[0].name}](${queue.songs[0].url})** \`[${queue.songs[0].formattedDuration}]\` • ${queue.songs[0].user}\n\n**Por venir:**${str == '' ? '  Nada' : '\n' + str }`)
				.setFooter({ text: `Página • ${i + 1}/${pagesNum} | ${queue.songs.length} • Canciones | ${queue.formattedDuration} • Duración total`});
			pages.push(embed);
		}

		if (!args) {
			if (pages.length == pagesNum && queue.songs.length > 10) QueuePage(client, interaction, pages, 60000, queue.songs.length, queue.formattedDuration);
			else return interaction.editReply({ embeds: [pages[0]] });
		}
		else {
			if (isNaN(args)) return interaction.editReply('La página tiene que ser un número');
			if (args > pagesNum) return interaction.editReply(`Te pasaste, namas hay ${pagesNum}.`);
			const pageNum = args == 0 ? 1 : args - 1;
			return interaction.editReply({ embeds: [pages[pageNum]] });
		}
	}
}
