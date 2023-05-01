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
		.setName(`${settings.slash_wallet_gencode}`)
        .setDescription(`${settings.descption_wallet_gencode}`)
        .addStringOption((option) =>
            option
            .setName("amount")
            .setDescription("Ammount add or remove wallet")
            .setRequired(true)
        ),
    async execute(interaction) {
		

        const member = interaction.member;
        const guild = interaction.member.guild.id;
        const wallet_amount = interaction.options.getString("amount").trim();

        if (!member.permissions.has("ADMINISTRATOR"))
        return interaction.reply({content: `You do not have permission to use this command please contact an administrator !`, ephemeral: true,});

        if (wallet_amount.length > 11) return interaction.reply("The amount is too excessive please reduce it !");
        if (isNaN(parseInt(wallet_amount))) return interaction.reply("Price not valid only numbers price please !");
     
        fetch(`${settings.linkapi}?ownerapi=${settings.ownerapi}&type=WalletGen&serverid=${guild}&amount=${wallet_amount}&format=text`)
		.then(res => res.text())
		.then(text => {
			if(!text.includes("message"))
			{
				interaction.editReply({ 
					embeds: [new Discord.MessageEmbed()
						.setColor(`${settings.ColorEmbed}`)
						.setTitle(`__${settings.NameBOT} - Generate Reload Wallet__`)
                        .setDescription(`**\nRemember to save and store your code, or connect to the dashboard then go to the wallets-reload page to find your generated codes.\n ** \u200B`)
                        .addField(`Code :`, `${text}`)
                        .addField(`Amount :`, `${wallet_amount}€`, true)
                        .addField(`ServerID :`, `${guild}`, true)
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