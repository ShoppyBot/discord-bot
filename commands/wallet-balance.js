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
		.setName(`${settings.slash_wallet_balance}`)
        .setDescription(`${settings.descption_wallet_balance}`)
        .addStringOption((option) => 
        option
            .setName("userid")
            .setDescription("Specify userid you want get wallet")
            .setRequired(false)
        ),
    async execute(interaction) {
		

        const member = interaction.member;
        const guild = interaction.member.guild.id;
        const wallet_user = interaction.options.getString("userid");

		if (!interaction.member.roles.cache.find(x => x.name == settings.RoleName))
    	return interaction.editReply({content: `You do not have permission to use this command please contact an administrator !`, ephemeral: true,});

        if (!wallet_user)
        {
            fetch(`${settings.linkapi}?ownerapi=${settings.ownerapi}&type=WalletBalance&serverid=${guild}&userid=${member.id}&format=text`)
			.then(res => res.text())
			.then(text => {
				if(!text.includes("message"))
				{
					interaction.editReply({ 
						embeds: [new Discord.MessageEmbed()
							.setColor(`${settings.ColorEmbed}`)
							.setTitle(`__${settings.NameBOT} -  Wallet Balance__`)
							.setDescription(`**\nYou currently have \`${text}${settings.CurrencyBOT}\` left to credit in your wallet\n**`)
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
        }
        else
        {
			fetch(`${settings.linkapi}?ownerapi=${settings.ownerapi}&type=WalletBalance&serverid=${guild}&userid=${wallet_user}&format=text`)
			.then(res => res.text())
			.then(text => {
				if(!text.includes("message"))
				{
					interaction.editReply({ 
						embeds: [new Discord.MessageEmbed()
							.setColor(`${settings.ColorEmbed}`)
							.setTitle(`__${settings.NameBOT} -  Wallet Balance__`)
							.setDescription(`**\nYou currently have \`${text}${settings.CurrencyBOT}\` left to credit on <@${wallet_user}> wallet\n**`)
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
        }
    },
};