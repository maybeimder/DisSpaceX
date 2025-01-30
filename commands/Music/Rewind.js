const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: ["music", "rewind"],
    description: "Atrasa la cancion unos segundos",
    category: "Music",
    options: [
        {
            name: "seconds",
            description: "Cuantos segundos ps",
            type: ApplicationCommandOptionType.Integer,
            required: false
        }
    ],
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const value = interaction.options.getInteger("seconds");
            
        const queue = client.distube.getQueue(interaction);
        if (!queue) return interaction.editReply(`[🦙] No hay na en la cola`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply("Teni que estar en el mismo canal de vo")

        if (!value) {
            if((queue.currentTime - 10) > 0) {

                await queue.seek(queue.currentTime - 10);
                
                const embed = new EmbedBuilder()
                    .setDescription(`\`⏮\` | *Devuelto a:* \`${queue.formattedCurrentTime}\``)
                    .setColor(client.color);

                interaction.editReply({ embeds: [embed] });

            } else {
                interaction.editReply(`[🦙] Don comedia`);
            }
        } else if ((queue.currentTime - value) > 0) {

            await queue.seek(queue.currentTime - value);
            
            const embed = new EmbedBuilder()
                .setDescription(`\`⏮\` | *Devuelto a:* \`${queue.formattedCurrentTime}\``)
                .setColor(client.color);

            interaction.editReply({ embeds: [embed] });

        } else { 
            interaction.editReply(`[🦙] Te pasaste Carlito, te pasaste`);
        }
    }
}