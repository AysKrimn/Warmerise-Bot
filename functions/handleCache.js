const cheerio = require('cheerio')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const get_or_create_log = require('./handleRegistery');


// helper function
const bekle = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time))
}

// page sayisi
let dynamic = 5;

const actionPhase = async (url) => {

if(!url) return;

console.log("page:", dynamic)

const request = await fetch(url).catch(e => {});

if(request.ok) {

const html = await request.text().catch(e => {});
const $ = cheerio.load(html);

const dataHolder = []

$("tbody tr td a").each(function(index, element) {

    let profileName = $(element).text().trim()
    let profileId = $(element).attr('alt')
    console.log("NAME:", profileName, "ID:", profileId)

    dataHolder.push({ name: profileName, id: profileId })
})

// asenkron olarak verileri ayıkl

for await (const veri of dataHolder) {
    console.log(veri.name, "ayıklanıyor...");
    get_or_create_log({currentName: veri.name, userId: veri.id})
    await bekle(2000)
}

dynamic++;
return actionPhase(`https://warmerise.com/pages/top100?page=${dynamic}&t=this_year`)

}

}



module.exports = actionPhase