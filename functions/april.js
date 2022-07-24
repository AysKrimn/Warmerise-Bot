const moment = require('moment-timezone');



const handleApril = () => {


const today = moment.tz(undefined, 'Europe/Istanbul').format('DD MM MMMM YYYY dddd HH:mm');

const components = today.split(' ');
console.log("Date:", components);


const day = components[0];
const month = components[1];
const monthName = components[2];



 if(day == "01" && month == "04" && monthName == "April") return true;

return false;



}







module.exports = handleApril;