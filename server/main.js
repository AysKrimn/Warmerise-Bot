const { Client, Collection, Intents } = require('discord.js');
const config = require('../token.json');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES], partials: ["MESSAGE"] });



// genel komutlar.
client.commands = new Collection();
client.limits = new Collection();

client.login(config.token2).then(() => {
client.user.setActivity({ name: "/info", type: "WATCHING"});

});



// @ TODO EXPRESS DAHA SONRADAN EKLENECEK 
module.exports = { application: client };