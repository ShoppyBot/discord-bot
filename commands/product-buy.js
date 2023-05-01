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
		.setName(`${settings.slash_product_buy}`)
        .setDescription(`${settings.descption_product_buy}`)
        .addStringOption((option) =>
        option
            .setName("product")
            .setDescription("Insert name product want to buy")
            .setRequired(true)
        ),
    async execute(interaction) 
    {
        const member = interaction.member;
        const guild = interaction.member.guild.id;
        const product = interaction.options.getString("product").trim();

        fetch(`${settings.linkapi}?ownerapi=${settings.ownerapi}&type=ProductBuy&serverid=${guild}&product=${product}&userid=${member.id}&format=text
        `)
		.then(res => res.text())
		.then(text => {
			if(!text.includes("message"))
			{
				interaction.editReply({ 
					embeds: [new Discord.MessageEmbed()
						.setColor(`${settings.ColorEmbed}`)
						.setTitle(`__${settings.NameBOT} - Product Buy__`)
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