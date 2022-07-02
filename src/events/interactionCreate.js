const handleReply = require('../../functions/reply');

module.exports = async (client, interaction) => {

    if (!interaction.isCommand()) return;
    console.log("interAction:", interaction);

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    const myPermissions = interaction.member.guild.me.permissions;
    // varsayılan mesaj gönder izni yoksa
    if(!myPermissions.has('SEND_MESSAGES')) return console.log("Sunucuda mesaj gönderme iznim yok.");
    // botun komutu çalıştırmak için gerekli izinleri yoksa
    if(command.botPermissions.length && !myPermissions.has(command.botPermissions)) {

    return handleReply('I need following permissions **Read Message History** and **Embed Links** to run this command.', interaction, true);
        
    }

    // rateLimit
    if(command.limits) {
    const current = client.limits.get(`${command}-${interaction.user.id}`);
    if(!current) client.limits.set(`${command}-${interaction.user.id}`, 1);      

    else {

    if(current >= command.limits.ratelimit) return handleReply("You are making a lot requests. Try again in 1 minutes.", interaction, true);
    client.limits.set(`${command}-${interaction.user.id}`, current + 1);  

    }

    setTimeout(() => {
    client.limits.delete(`${command}-${interaction.user.id}`);
        
    }, command.limits.cooldown)

    }

    try {

    command.run(client, { interaction: interaction, reply: handleReply });
            
    } catch (error) {
            
    handleReply("An error occured. Please try again in a few minutes later.", interaction, true);
    console.log(error);
        
    }


}