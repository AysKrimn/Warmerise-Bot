const registerSlashCommands = require('../base/handleSlashCommands');


module.exports = async (client) => {

    const guilds = [...client.guilds.cache.values()];

    for ( const guild of guilds ) {


    registerSlashCommands(guild);

    console.log(guild.name, "için slash komutları eklendi.");
    
   }


   console.log(client.user.name, "hazır.");
}