const registerSlashCommands = require('../base/handleSlashCommands');

module.exports = async (client, guild) => {
// slash komutlarını oluştur
registerSlashCommands(guild);

}