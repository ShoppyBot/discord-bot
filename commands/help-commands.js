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
        .setName(`${settings.slash_help_commands}`)
        .setDescription(`${settings.descption_help_commands}`),
    async execute(interaction) {

      const member = interaction.member;
      const guild = interaction.member.guild.id;

      if (member.permissions.has("ADMINISTRATOR"))
      {
        interaction.editReply({ 
          embeds: [new Discord.MessageEmbed()
            .setColor(`${settings.ColorEmbed}`)
            .setTitle(`__${settings.NameBOT} -  Help Commands __`)
            .setThumbnail(`${settings.AvatarBOT}`)
            .addField(`/${settings.slash_clear_messages}`, `${settings.descption_clear_messages}`)
            .addField(`/${settings.slash_help_commands}`, `${settings.descption_help_commands}`)
            .addField(`/${settings.slash_key_add}`, `${settings.descption_key_add}`)
            .addField(`/${settings.slash_key_gen}`, `${settings.descption_key_gen}`)
            .addField(`/${settings.slash_key_stock}`, `${settings.descption_key_stock}`)
            .addField(`/${settings.slash_product_add}`, `${settings.descption_product_add}`)
            .addField(`/${settings.slash_product_buy}`, `${settings.descption_product_buy}`)
            .addField(`/${settings.slash_product_edit}`, `${settings.descption_product_edit}`)
            .addField(`/${settings.slash_wallet_edit}`, `${settings.descption_wallet_edit}`)
            .addField(`/${settings.slash_wallet_get}`, `${settings.description_wallet_get}`)
            .addField(`/${settings.slash_wallet_reload}`, `${settings.description_wallet_reload}`)
            .setImage(`${settings.ImageBOT}`)
            .setFooter({
              text: settings.FooterEmbedText,
              iconURL: settings.AvatarBOT
            })
            .setTimestamp()
          ], ephemeral: true
        })
      }
      else if (interaction.member.roles.cache.find(x => x.name == settings.RoleName))
      {
        interaction.editReply({ 
          embeds: [new Discord.MessageEmbed()
            .setColor(`${settings.ColorEmbed}`)
            .setTitle(`__${settings.NameBOT} -  Help Commands __`)
            .setThumbnail(`${settings.AvatarBOT}`)
            .addField(`/${settings.slash_help_commands}`, `${settings.descption_help_commands}`)
            .addField(`/${settings.slash_key_gen}`, `${settings.descption_key_gen}`)
            .addField(`/${settings.slash_key_stock}`, `${settings.descption_key_stock}`)
            .addField(`/${settings.slash_product_buy}`, `${settings.descption_product_buy}`)
            .addField(`/${settings.slash_wallet_get}`, `${settings.description_wallet_get}`)
            .addField(`/${settings.slash_wallet_reload}`, `${settings.description_wallet_reload}`)
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
        interaction.editReply({ 
          embeds: [new Discord.MessageEmbed()
            .setColor(`${settings.ColorEmbed}`)
            .setTitle(`__${settings.NameBOT} -  Help Commands __`)
            .setThumbnail(`${settings.AvatarBOT}`)
            .addField(`/${settings.slash_help_commands}`, `${settings.descption_help_commands}`)
            .addField(`/${settings.slash_product_buy}`, `${settings.descption_product_buy}`)
            .addField(`/${settings.slash_wallet_get}`, `${settings.description_wallet_get}`)
            .addField(`/${settings.slash_wallet_reload}`, `${settings.description_wallet_reload}`)
            .setImage(`${settings.ImageBOT}`)
            .setFooter({
              text: settings.FooterEmbedText,
              iconURL: settings.AvatarBOT
            })
            .setTimestamp()
          ], ephemeral: true
        })
      }
    },
};
