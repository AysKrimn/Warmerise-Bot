const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const cheerio = require('cheerio');

const handleStats = require('../../functions/handleStats');
const getUserId = require('../../functions/script');
const get_or_create_log = require('../../functions/handleRegistery')
const { escapeMarkDown } = require('../../functions/escapeCharacters');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

//  TODO:
// add, get fonksiyonu eklenecek ve user id üzerinden name tracker.

const baseURL = "https://warmerise.com";



module.exports = {
    botPermissions: ["READ_MESSAGE_HISTORY", "EMBED_LINKS"],
    limits: { ratelimit: 3, cooldown: 1e4 },

    data: new SlashCommandBuilder()
    .setName('info')
    .setDescription("Returns specified user's profile")

    .addStringOption(option =>
     option.setName('username')
    .setDescription("User's Warmerise profile name")
    .setRequired(true))

    .addStringOption(option =>
		option.setName('stats')
			.setDescription("Option to display users yearly or all time stats.")
            .setRequired(true)
            .addChoice('This Year', 'this_y')
            .addChoice('All Time', "all_t")),


    async run(client, constants) {
    await constants.interaction.deferReply().catch(e => {});

    let query;
    let e_title = "User Stats";
    let userName = constants.interaction.options.getString('username');

    const isUrl = userName.startsWith('https');
    const userStats = constants.interaction.options.getString('stats');


    if(userStats == "this_y") {
    query = ".this_year"
    e_title += " (This Year)"

    } else query = ".all_time";

    if(isUrl) {
    const parseUrl = userName.split('/');
    const profileName = parseUrl[parseUrl.length -1];
    userName = profileName;
    }

    const path = `https://warmerise.com/profile/${userName}`;
    const url = encodeURI(path);

    const request = await fetch(url).catch(e => {});

    console.log("STATUS CODE:", request.status);
    if(request.status == 403) return constants.interaction.editReply("I don't have permission to view this private page.");

    if(request.ok) {

    console.log("req",request)
    // burası bize html'i verir.
    const html = await request.text().catch(e => {});
    const $ = cheerio.load(html);

    let profileName = $("#profile_status h2").text().trim();
    const userId = getUserId($);
    console.log("USER ID:", userId)
    const userNames = await get_or_create_log({userId: userId, currentName: profileName})
    console.log("userin logları:", userNames)
    const listItems = $(".layout_page_user_profile_index"); 

    listItems.each(function(idx, li) {

    let color = "GREEN";
    let image = $(li).find('img').attr('src'); 

    let rankRef = $(query + " td").not('id').find('a').attr('href');
    
    query += " .row-title";

    let rank = $(query).first(function() {
    return $(this).text() === 'Rank';
    }).next().text().trim();

    let xp = $(query).filter(function() {
    return $(this).text() === 'XP';
    }).next().text().trim();
        
    let kills = $(query).filter(function() {
    return $(this).text() === 'Kills';
    }).next().text().trim();
        
    let deaths = $(query).filter(function() {
    return $(this).text() === 'Deaths';
    }).next().text().trim();
        
    let kdr = $(query).filter(function() {
    return $(this).text() === 'KDR';
    }).next().text().trim();
        
    let hk = $(query).filter(function() {
    return $(this).text() === 'Highest Killstreak';
    }).next().text().trim();


    let weaponStats = handleStats($, userStats)


    // KLANLAR VE TOPLAM KLAN SAYISI BOLUMU BURADA BASLAR

    let clans = [];

    $('#profile_groups > li').each((i, element) => {

    const c_name = escapeMarkDown($(element).find('.groups_profile_tab_title').find('a').text());
    const c_link = $(element).find('.groups_profile_tab_title').find('a').attr('href');
    
    clans.push(`[${c_name}](${baseURL}${c_link})`);

    });

    if(clans.length) {
  
    let totalClan; 
    let pattern = /\d+/g;

    const tabs = $('li:contains("Groups")').text().trim();
    const tabContent = tabs.split(' ');

     // tabcontent 1. dizin sadece rakamı verir.
     if(tabContent.length == 1) totalClan = tabContent[0].match(pattern);
     if(tabContent.length > 1) totalClan = tabContent[1].match(pattern);
  
    console.log("clan sayisi:", totalClan);

    if(totalClan && totalClan > 5) clans.push(` ${totalClan - 5} and more.`); 

    } else clans.push("Not a member of any clan.");

    // KLANLAR VE TOPLAM KLAN SAYISI BOLUMU BITER
    
     const created = $(li)
    .find("div[class='generic_layout_container layout_user_profile_info']")
    .find("span[class='timestamp']")
    .last().text();

    let footer = `• Joined: ${created}`;

    if(!created) { footer = "• This profile is private."; clans[0] = false; } 


    const badges = [];

    $(li).find("div[class='badge-wrapper']").each((i, element) => {

    const place = $(element).find('a').attr('title');
    const e_link = $(element).find('a').attr('href');

    console.log("Event Place ve link:", place, e_link);

    badges.push(`[${place}](${baseURL}${e_link})`);

    });


    let goTo;

    if(rankRef) goTo = `https://warmerise.com/${rankRef}`;


    switch(rank) {
    case "Not ranked yet":
    color = "ORANGE"
    break;

    case "[Banned]":
    rank = "**Banned**";
    color = "RED";
    break;

    case "1":
    rank = `[${"🥇"}](${goTo})`;
    break;

    case "2":
    rank = `[${"🥈"}](${goTo})`;
    break;

    case "3":
    rank = `[${"🥉"}](${goTo})`;

    break;

    default: 

    if(rank >= 4 && rank <= 100) rank = `🏅 [${rank}](${goTo})`;
    if(rank > 100) rank = `[${rank}](${goTo})`;

    }


    const embed = new MessageEmbed()
    .setColor(color)
    .setDescription(`>>> ${e_title}\nRank: ${rank}\nXP: ${xp}\nKills: ${kills}\nDeaths: ${deaths}\nKDR: ${kdr}\nHighest Killstreak: ${hk}\nFavourite Weapon: ${weaponStats.mostKills}`)
    .setThumbnail(`${baseURL}/${image}`)
   
    .setFooter({ text: footer });

    console.log("CLANS:", clans);
    // clan section false değilse clanları göster
    if(clans[0] != false) embed.description += `\nClan(s): ${clans.join(' ')}`;
    // badgeler varsa badgeleri göster
    if(badges.length) embed.description += `\nAchievements/Victories:\n${badges.join('\n')}`;
    // previousNames
    console.log("veri:", userNames)

    if(userNames.data && userNames.status == true && userNames.data.previousNames.length) { 
    
      embed.description += `\nPrevious Names:\n${userNames.data.previousNames.join(', ')}`

    }

    let displayMsg;

    Number(userName) ? displayMsg = `${url} (${profileName})` : displayMsg = url;

    constants.interaction.editReply({ content: displayMsg, embeds: [embed] });
  

    }); // listeItems biter




    // profile bulunamadıysa
    } else {

        const path = `https://warmerise.com/members?displayname=${userName}`;
        const url = encodeURI(path);

        const request = await fetch(url);
    
        if(request.ok) {

        let n;

        const html = await request.text().catch(e => {});
        const $ = cheerio.load(html);


        const results = $('#browsemembers_results').find('h3').text().trim().split(' ');

        [n] = results;

        const foundUsers = [];

        $('#browsemembers_ul > li').each((i, element) => {

        const u_name = $(element).find('a').text().trim();
        const u_link = $(element).find('a').attr('href');

        console.log("link:", u_link)

        foundUsers.push(`• [${u_name}](${baseURL}${u_link})`);

        });

        console.log("search:", foundUsers);

        if(!foundUsers.length) return constants.interaction.editReply("Could not find requested player.");
     

        // embedi gönder
        const embed = new MessageEmbed()
        .setColor('GREEN')
        .addField("Search Results", foundUsers.join('\n').toString())
        .setTimestamp();


        if(Number(n) > 10) { embed.setTitle(`${n} match`); embed.setURL(path) }

        constants.interaction.editReply({ embeds: [embed]});
        

    }
    }

    }


}
