const { application } = require('./server/main');
const { readdir } = require('fs');

readdir("./src/events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
    if(!file.endsWith('.js')) return;
      
    const event = require(`./src/events/${file}`);
    const listener = file.split(".")[0];
    application.on(listener, event.bind(null, application));
    });
});