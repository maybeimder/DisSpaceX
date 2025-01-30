const { EmbedBuilder } = require('discord.js');
const { Database } = require("st.db");

const GVoice = new Database("./settings/models/voice.json", { databaseInObject: true });

module.exports = {
    name: ["music", "247"],
    description: "24/7 dando caleta, lo activas?",
    category: "Music",
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });
        
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply("Teni que estar en el mismo cana de vo")

        const db = await GVoice.get(interaction.guild.id);

        if (db.voice_enable === true) {
            await client.createDVoice(interaction);

            const embed = new EmbedBuilder()
                .setDescription(`\`🌙\` | *[🦙] 24/7 no estoy* \`Deactivated\``)
                .setColor(client.color);

            interaction.editReply({ embeds: [embed] });
        } else if (db.voice_enable === false) {
            await client.createEVoice(interaction);

            const embed = new EmbedBuilder()
                .setDescription(`\`🌕\` | *[🦙] 24/7 beibi:* \`Activated\``)
                .setColor(client.color);

            interaction.editReply({ embeds: [embed] });
        }
    }
}