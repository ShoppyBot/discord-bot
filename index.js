const db = require('quick.db');
const fetch = require('node-fetch');
const fs = require("fs");
const path = require("path");
let settings = JSON.parse(fs.readFileSync("config.json", "utf-8"));


const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { Client, Intents, Collection, MessageEmbed } = require("discord.js");
const Discord = require('discord.js');

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS
    ]
})

const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"))
const commands = [];

client.commands = new Collection();

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
}

client.on("error", console.error);

process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});

client.once('ready', async() => {
    console.clear();
    console.log("Bot Online");
    console.log("Logged in as :", client.user.tag)

    const CLIENT_ID = client.user.id;

    const rest = new REST({
        version: "9"
    }).setToken(settings.token);

    (async () => {
        try {
            if (settings.type === "production") {
              //  await rest.put(Routes.applicationCommands(CLIENT_ID), {
              //      body: commands
              //  });
                console.log("Added Commands")
            } 
            else if (settings.type === "delete_commands") {
                await rest.put(Routes.applicationCommands(CLIENT_ID), {
                    body: []
                });
                console.log("Delete All Commands")
            }
            else if (settings.type === "debug") {
                await rest.put(Routes.applicationCommands(CLIENT_ID), {
                    body: []
                }), rest.put(Routes.applicationGuildCommands(CLIENT_ID, settings.serverid), {
                    body: commands
                });
                console.log("Commands Are setuped to Guild Only")
            }
        } catch (err) {
            console.error(err);
        }
    })();

});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    await interaction.deferReply({ ephemeral: true });
	
//	if(interaction.member != null)
//	if(!interaction.member.roles.cache.find(x => x.name == "shoppy")) return interaction.editReply({ embeds: [new Discord.MessageEmbed().setDescription(`You need a role with the name \`perms\` to execute commands. Please ask an administrator to create a role with this name if not already done and assign it to you.`).setColor("RED").setTimestamp()], ephemeral: true})

    const errorembed = new MessageEmbed()
    .setAuthor({ name: "Interaction Failed" })
    .setColor("RED")
    .setTimestamp()
    .setFooter({ text: "ShoppyBot", iconURL: client.user.displayAvatarURL()})

	let idfrom = null;
	
	if(interaction.guild == null)
		idfrom = interaction.user.id;
	else
		idfrom = interaction.guild.id;
	
	let content = `**${interaction.user.username}#${interaction.user.discriminator} (ID: ${interaction.user.id})** executed the command \`/${interaction.commandName}\`\n`;
	
	for (var i = 0; i < interaction.options._hoistedOptions.length; i++) {
    content += "\n" + interaction.options._hoistedOptions[i].name + " : " + interaction.options._hoistedOptions[i].value;
	}
	
	/*
    let wh_url = await db.get(`wh_url_${idfrom}`)
	if(wh_url != null) {
		var params = {
			content: content
		}
		fetch(wh_url, {
			method: "POST",
			headers: {
				'Content-type': 'application/json'
			},
			body: JSON.stringify(params)
		})
	}
    */
		
    try {
        await command.execute(interaction);
    } catch(err) {
        if (err) console.error(err);

        await interaction.editReply({
            embeds: [errorembed],
            ephemeral: true
        })
    }
});

client.login(settings.token);
