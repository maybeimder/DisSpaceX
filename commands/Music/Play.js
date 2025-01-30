const { PermissionsBitField, ApplicationCommandOptionType } = require("discord.js");
const { Database } = require("st.db");

const GSetup = new Database("./settings/models/setup.json", { databaseInObject: true });

module.exports = {
    name: ["play"],
    description: "Reproduzco la cancion que me digas ",
    category: "Music",
    options: [
        {
            name: "search",
            type: ApplicationCommandOptionType.String,
            description: "Que cancion manin?",
            required: true,
            autocomplete: true
        }
    ],
    run: async (client, interaction) => {
        try {
            if (interaction.options.getString("search")) {
                const db = await GSetup.get(interaction.guild.id);
                if (db.setup_enable === true) return interaction.reply("comollegamoshastaaca");

                await interaction.reply(`🔍 **[🦙] Buscandoo...** \`${interaction.options.getString("search")}\``);

                const message = await interaction.fetchReply();
                await client.createPlay(interaction, message.id);

                const { channel } = interaction.member.voice;
                if (!channel) return interaction.editReply("Teni' que estar en un canal de voz.")
                if (!channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.Connect)) return interaction.editReply(`[🦙] No me puedo \`CONNECT\` a ${channel.name}`);
                if (!channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.Speak)) return interaction.editReply(`[🦙] No puedo \`SPEAK\` en ${channel.name}`);

                try {
                    const string = interaction.options.getString("search");

                    const options = {
                        member: interaction.member,
                        textChannel: interaction.channel,
                        interaction,
                    }

                    await client.distube.play(interaction.member.voice.channel, string, options);
                } catch (e) {
                    //
                }
            }
        } catch (e) {
            //
        }
    }
}
