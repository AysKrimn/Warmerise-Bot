// content içerik , interaction slash komut objesi.
const reply = (content, interaction, hide) => {

if(hide) { return interaction.reply({ content: content, ephemeral: true }); }


interaction.reply({ content: content });

}



module.exports = reply;