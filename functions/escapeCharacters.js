// @Warmerise Clan isimlerinin discord-özel kodlarını escape atan fonksiyon burasıdır.

function escapeStr(text) {
console.log("[ESC] STR:", text);

if(text === undefined || text === null) return;
const escaped = text.replace(/((\_|\*|\~|\`|\|){2})/g, '\\$1');

return escaped;
}




module.exports = { escapeMarkDown: escapeStr };