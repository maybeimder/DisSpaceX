const { PermissionsBitField, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const { Database } = require("st.db");
const ytsr = require("@distube/ytsr");

const GSetup = new Database("./settings/models/setup.json", { databaseInObject: true });

module.exports = {
    name: ["music", "searchskip"],
    description: "Otro para egoistas, busca la cancion y skipea hasta la tuya",
    category: "Music",
    options: [
        {
            name: "search",
            type: ApplicationCommandOptionType.String,
            description: "Que canción?",
            required: true
        }
    ],
    run: async (client, interaction) => {
        const string = interaction.options.getString("search");

        const db = await GSetup.get(interaction.guild.id);
        if (db.setup_enable === true) return interaction.reply("quepasoaca");

        await interaction.reply(`🔍 **Buscandooo...** \`${string}\``);

        const message = await interaction.fetchReply();
        await client.createPlay(interaction, message.id);

        const { channel } = interaction.member.voice;
        if (!channel) return interaction.editReply("Teni' que estar en un canal de voz.")
        if (!channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.Connect)) return interaction.editReply(`[🦙] No me puedo \`CONNECT\` a ${channel.name}`);
        if (!channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.Speak)) return interaction.editReply(`[🦙] No puedo \`SPEAK\` en ${channel.name}`);

        const row = new  ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId("one")
            .setEmoji("1️⃣")
            .setStyle(ButtonStyle.Secondary)
        )
        .addComponents(
          new ButtonBuilder()
            .setCustomId("two")
            .setEmoji("2️⃣")
            .setStyle(ButtonStyle.Secondary)
        )
        .addComponents(
          new ButtonBuilder()
            .setCustomId("three")
            .setEmoji("3️⃣")
            .setStyle(ButtonStyle.Secondary)
        )
        .addComponents(
          new ButtonBuilder()
            .setCustomId("four")
            .setEmoji("4️⃣")
            .setStyle(ButtonStyle.Secondary)
        )
        .addComponents(
          new ButtonBuilder()
            .setCustomId("five")
            .setEmoji("5️⃣")
            .setStyle(ButtonStyle.Secondary)
        )

        const options = {
            member: interaction.member,
            textChannel: interaction.channel,
            interaction,
            skip: true
        }

        const res = await ytsr(string, { safeSearch: true, limit: 5 });

        let index = 1;
        const result = res.items.slice(0, 5).map(x => `**(${index++}.) [${x.name}](${x.url})** Author: \`${x.author}\``).join("\n")

        const embed = new EmbedBuilder()
            .setAuthor({ name: `Elegí pibe...`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .setColor(client.color)
            .setDescription(result)
            .setFooter({ text: `No tengo todo el dia asi que dale rapido` })

        await message.edit({ content: " ", embeds: [embed], components: [row] });

        const collector = interaction.channel.createMessageComponentCollector({ filter: (m) => m.user.id === interaction.user.id, time: 30000, max: 1 });

        collector.on('collect', async (interaction) => {
            const id = interaction.customId;
            const loader = new EmbedBuilder()
            .setDescription("**Cargando, perate...**")


            if(id === "one") {
                await message.edit({ embeds: [loader], components: [] });
                await client.distube.play(interaction.member.voice.channel, res.items[0].url, options);
            } else if(id === "two") {
                await message.edit({ embeds: [loader], components: [] });
                await client.distube.play(interaction.member.voice.channel, res.items[1].url, options);
            } else if(id === "three") {
                await message.edit({ embeds: [loader], components: [] });
                await client.distube.play(interaction.member.voice.channel, res.items[2].url, options);
            } else if(id === "four") {
                await message.edit({ embeds: [loader], components: [] });
                await client.distube.play(interaction.member.voice.channel, res.items[3].url, options);
            } else if(id === "five") {
                await message.edit({ embeds: [loader], components: [] });
                await client.distube.play(interaction.member.voice.channel, res.items[4].url, options);
            }
        });

        collector.on('end', async (collected, reason) => {
            if(reason === "time") {
                message.edit({ content: `[🦙] No respondiste pue, mandas cáscara`, embeds: [], components: [] });
            }
        });
    }
}
