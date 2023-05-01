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
		.setName(`${settings.slash_product_add}`)
        .setDescription(`${settings.descption_product_add}`)
        .addStringOption((option) =>
        option
            .setName("ptype")
            .setDescription("Select type of delivery")
            .setRequired(true)
            .addChoice(`key`, "key")
            .addChoice(`service`, "service")
        )
        .addStringOption((option) =>
        option
            .setName("name")
            .setDescription("Insert name product")
            .setRequired(true)
        )
        .addStringOption((option) =>
        option
            .setName("price")
            .setDescription("Insert price product")
            .setRequired(true)
        )
        .addStringOption((option) =>
        option
            .setName("description")
            .setDescription("Insert description product")
            .setRequired(true)
        ),
    async execute(interaction) {
		

        const member = interaction.member;
        const guild = interaction.member.guild.id;
        const ptype = interaction.options.getString("ptype").trim();
        const name = interaction.options.getString("name").trim();
        const price = interaction.options.getString("price").trim();
        const description = interaction.options.getString("description").trim();

        if (!member.permissions.has("ADMINISTRATOR"))
        return interaction.reply({content: `You do not have permission to use this command please contact an administrator !`, ephemeral: true,});
        
        if (name.length > 254) return interaction.reply("Title of your product is too long (254 characters max) !");
        if (description.length > 254) return interaction.reply("Description of your product is too long (254 characters max) !");
        if (price.length > 11) return interaction.reply("The amount is too excessive please reduce it !");
        if (isNaN(parseInt(price))) return interaction.reply("Price not valid only numbers price please !");


        fetch(`${settings.linkapi}?ownerapi=${settings.ownerapi}&type=ProductAdd&serverid=${guild}&ptype=${ptype}&name=${name}&price=${price}&description=${description}&format=text
        `)
		.then(res => res.text())
		.then(text => {
			if(!text.includes("message"))
			{
				interaction.editReply({ 
					embeds: [new Discord.MessageEmbed()
						.setColor(`${settings.ColorEmbed}`)
						.setTitle(`__${settings.NameBOT} - Product Add__`)
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