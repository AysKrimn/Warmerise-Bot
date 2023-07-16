const fs = require('fs/promises');
const path = "./storage/names.json"

const get_or_create_log = async data => {
    const schema = { userId: data.userId, currentName: data.currentName, previousNames: []}  

    let fileContents = await fs.readFile(path, { encoding: 'utf8' });
    fileContents = JSON.parse(fileContents);
    const user = fileContents.find(log => log.userId == data.userId);

    // user varsa ve isim değişikliği yapmışsa
    if(user) {

        if(user.currentName !== data.currentName) {
            user.previousNames.push(user.currentName);
            user.currentName = data.currentName;
            // kayıt et
            fileContents.push(user);
            await fs.writeFile(path, JSON.stringify(fileContents, null, 2), { encoding: 'utf8' });
        }

        // useri döndür
        return { data: user, status: true}
    }

    // user varsa ama herhangi bir değişiklik yapılmamışsa
    if(user) {

        return { data: "Could not find any change on user.", status: false}
    }

    // user yoksa loglara kayıt et
    if(!user) {  

        fileContents.push(schema);
        await fs.writeFile(path, JSON.stringify(fileContents, null, 2), { encoding: 'utf8' });
        return { data: "Could not find the user therefore added to log.", status: false}
        
    }
}



 
module.exports = get_or_create_log