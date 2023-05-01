const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require('discord.js');

const db = require('quick.db');
const fetch = require('node-fetch');
const fs = require("fs");
const path = require("path");
let mainPath = path.join(__dirname, "..");
let settings = JSON.parse(fs.readFileSync(mainPath + "/config.json", "utf-8"));

module.exports = {
    data: new SlashCommandBuilder()
		.setName(`${settings.slash_wallet_reload}`)
        .setDescription(`${settings.description_wallet_reload}`)
        .addStringOption((option) => 
        option
            .setName("code")
            .setDescription("Insert your reload code")
            .setRequired(true)
        ),
    async execute(interaction) {
		

        const member = interaction.member;
        const guild = interaction.member.guild.id;
        const code = interaction.options.getString("code");

        if (!code)
        return interaction.editReply({content: `Please insert your reload code !`, ephemeral: true,});

     
        fetch(`${settings.linkapi}?ownerapi=${settings.ownerapi}&type=WalletReload&serverid=${guild}&userid=${member.id}&code=${code}&format=text`)
		.then(res => res.text())
		.then(text => {
			if(!text.includes("message"))
			{
				interaction.editReply({ 
					embeds: [new Discord.MessageEmbed()
						.setColor(`${settings.ColorEmbed}`)
						.setTitle(`__${settings.NameBOT} -  Reload Wallet__`)
						.setDescription(`**\n${text}\n**`)
						.setImage(`${settings.ImageBOT}`)
						.setFooter({
							text: settings.FooterEmbedText,
							iconURL: settings.AvatarBOT
						})
						.setTimestamp()
					], ephemeral: true
				})
			}
			else
			{
				let json = JSON.parse(text);
				interaction.editReply({ 
					embeds: [new Discord.MessageEmbed()
						.setColor("RED")
						.setTitle(`${settings.NameBOT}`)
						.setDescription(`**\n${json.message}\n**`)
						.setImage(`${settings.ImageBOT}`)
						.setFooter({
							text: settings.FooterEmbedText,
							iconURL: settings.AvatarBOT
						})
						.setTimestamp()
					], ephemeral: true
				})
			}
		})
               
    },
};