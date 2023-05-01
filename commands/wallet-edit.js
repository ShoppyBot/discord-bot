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
		.setName(`${settings.slash_wallet_edit}`)
        .setDescription(`${settings.descption_wallet_edit}`)
        .addStringOption((option) =>
            option
            .setRequired(true)
            .setName("userid")
            .setDescription("Specify userid you want edit wallet")
        )
        .addStringOption((option) =>
            option
            .setName("setting")
            .setDescription("Setting to edit")
            .setRequired(true)
            .addChoice(`add`, "add")
            .addChoice(`remove`, "remove")
        )
        .addStringOption((option) =>
            option
            .setName("amount")
            .setDescription("Ammount add or remove wallet")
            .setRequired(true)
        ),
    async execute(interaction) {
		

        const member = interaction.member;
        const guild = interaction.member.guild.id;
        const wallet_user = interaction.options.getString("userid").trim();
        const wallet_setting = interaction.options.getString("setting");
        const wallet_amount = interaction.options.getString("amount").trim();

        if (!wallet_user)
        return interaction.reply({content: `Please specify wallet user edit !`, ephemeral: true,});

        if (!member.permissions.has("ADMINISTRATOR"))
        return interaction.reply({content: `You do not have permission to use this command please contact an administrator !`, ephemeral: true,});

		if (wallet_amount.length > 11) return interaction.reply("The amount is too excessive please reduce it !");
        if (isNaN(parseInt(wallet_amount))) return interaction.reply("Price not valid only numbers price please !");

     
        fetch(`${settings.linkapi}?ownerapi=${settings.ownerapi}&type=WalletEdit&serverid=${guild}&userid=${wallet_user}&edit=${wallet_setting}&amount=${wallet_amount}&format=text`)
		.then(res => res.text())
		.then(text => {
			if(!text.includes("message"))
			{
				interaction.editReply({ 
					embeds: [new Discord.MessageEmbed()
						.setColor(`${settings.ColorEmbed}`)
						.setTitle(`__${settings.NameBOT} -  Edit Wallet__`)
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