const { PermissionsBitField, ApplicationCommandOptionType } = require("discord.js");
const { Database } = require("st.db");

const GSetup = new Database("./settings/models/setup.json", { databaseInObject: true });

module.exports = {
    name: ["playfile"],
    description: "Si tienes un mp3, wav o algo asi, ponelo pue",
    category: "Music",
    options: [
        {
            name: "file",
            type: ApplicationCommandOptionType.Attachment,
            description: "archivooo",
            required: true,
        }
    ],
    run: async (client, interaction) => {
        try {
            if (interaction.options.getAttachment("file")) {
                const db = await GSetup.get(interaction.guild.id);
                if (db.setup_enable === true) return interaction.reply("comollegamoshastaaca");

                await interaction.reply(`🔍 **Cargandoo...** \`${interaction.options.getAttachment("file").name}\``);

                const message = await interaction.fetchReply();
                await client.createPlay(interaction, message.id);

                const { channel } = interaction.member.voice;
                if (!channel) return interaction.editReply("Pero métete al canal de voz pue")
                if (!channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.Connect)) return interaction.editReply(`[🦙] No me puedo \`CONNECT\` a ${channel.name}`);
                if (!channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.Speak)) return interaction.editReply(`[🦙] No puedo \`SPEAK\` en ${channel.name}`);
                
                try {
                    const string = interaction.options.getAttachment("file").url;

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
