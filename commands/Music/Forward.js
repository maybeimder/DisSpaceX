const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: ["music", "forward"],
    description: "Adelanta la cancion a un min especifico",
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

        const song = queue.songs[0];

        if (!value) {
            if((queue.currentTime + 10) < song.duration) {

                await queue.seek(queue.currentTime + 10);
                
                const embed = new EmbedBuilder()
                    .setDescription(`\`⏭\` | *Adelantao a:* \`${queue.formattedCurrentTime}\``)
                    .setColor(client.color);

                interaction.editReply({ embeds: [embed] });

            } else {
                interaction.editReply(`[🦙] Me vas a coger de cocheteo? esa cancion no dura tanto ombe respete`);
            }
        } else if ((queue.currentTime + value) < song.duration) {

            await queue.seek(queue.currentTime + value);
            
            const embed = new EmbedBuilder()
                .setDescription(`\`⏭\` | *Adelantar a* \`${queue.formattedCurrentTime}\``)
                .setColor(client.color);

            interaction.editReply({ embeds: [embed] });

        } else { 
            interaction.editReply(`[🦙] aja, cual es la maricá con los numeros en negativo`);
        }
    }
}