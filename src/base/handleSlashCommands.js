const { application } = require('../../server/main');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const fs = require('node:fs');
const config = require('../../token.json');

const commands = [];
const commandFiles = fs.readdirSync('./src/interactions').filter(file => file.endsWith('.js'));


for (const file of commandFiles) {
const command = require(`../interactions/${file}`);
const file_name = file.split(".")[0];

commands.push(command.data.toJSON());
// client komutlarına da ekle
application.commands.set(file_name, command);
}

const rest = new REST({ version: '9'}).setToken(config.token2);

// slash komutlarını kaydet
const call = (guild) => {

(async () => {
	try {
		console.log('Uygulama komutları (/) yükleniyor.');

		await rest.put(
			Routes.applicationGuildCommands(application.user.id, guild.id),
			{ body: commands },
		);

       console.log('/ komutları başarılı bir şekilde yüklendi.');
       
	} catch (error) {
		console.error(error);
	}
})();

}


module.exports = call;