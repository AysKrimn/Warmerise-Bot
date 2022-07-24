const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const cheerio = require('cheerio');
const handleStats = require('../../functions/handleStats');
const handleApril = require('../../functions/april');

const { escapeMarkDown } = require('../../functions/escapeCharacters');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');



module.exports = {
    botPermissions: ["READ_MESSAGE_HISTORY", "EMBED_LINKS"],
    limits: { ratelimit: 3, cooldown: 1e4 },

    data: new SlashCommandBuilder()
    .setName('info')
    .setDescription("Returns specified user's profile")
    .addStringOption(option =>
     option.setName('username')
    .setDescription("User's Warmerise profile name")
    .setRequired(true)),


    async run(client, constants) {
    await constants.interaction.deferReply();

    const isApril = handleApril();
        
    let userName = constants.interaction.options.getString('username');
    const isUrl = userName.startsWith('https');

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
    // burası bize html'i verir.
    const html = await request.text().catch(e => {});
    const $ = cheerio.load(html);

    $('.datagrid').each((i, el) => {
    const listItems = $(".layout_page_user_profile_index"); 

    listItems.each(function(idx, li) {

    let color = "GREEN";
    let image =  $(li).find('img').attr('src'); 
    let profileName = $(li).find('h2').text().trim();

    let rank = $('.row-title').first(function() {
    return $(this).text() === 'Rank';
    }).next().text().trim();
        
    let xp = $('.row-title').filter(function() {
    return $(this).text() === 'XP';
    }).next().text().trim();
        
    let kills = $('.row-title').filter(function() {
    return $(this).text() === 'Kills';
    }).next().text().trim();
        
    let deaths = $('.row-title').filter(function() {
    return $(this).text() === 'Deaths';
    }).next().text().trim();
        
    let kdr = $('.row-title').filter(function() {
    return $(this).text() === 'KDR';
    }).next().text().trim();
        
    let hk = $('.row-title').filter(function() {
    return $(this).text() === 'Highest Killstreak';
    }).next().text().trim();

    let tableContent = $(el).children().text().trim();

    let weaponStats = handleStats(tableContent);
    
    console.log("Veriler:", weaponStats);


    // KLANLAR VE TOPLAM KLAN SAYISI BOLUMU
    const groups = $('#profile_groups').map((i, element) => ({

    Clan1: escapeMarkDown($(element).find('.groups_profile_tab_title').eq(0).text().trim()),
    Clan2: escapeMarkDown($(element).find('.groups_profile_tab_title').eq(1).text().trim()),
    Clan3: escapeMarkDown($(element).find('.groups_profile_tab_title').eq(2).text().trim()),
    Clan4: escapeMarkDown($(element).find('.groups_profile_tab_title').eq(3).text().trim()),
    Clan5: escapeMarkDown($(element).find('.groups_profile_tab_title').eq(4).text().trim()),
            
    Link1: $(element).find('.groups_profile_tab_title').eq(0).find('a').attr('href'),
    Link2: $(element).find('.groups_profile_tab_title').eq(1).find('a').attr('href'),
    Link3: $(element).find('.groups_profile_tab_title').eq(2).find('a').attr('href'),
    Link4: $(element).find('.groups_profile_tab_title').eq(3).find('a').attr('href'),
    Link5: $(element).find('.groups_profile_tab_title').eq(4).find('a').attr('href')
    })).get()


    let totalClan; 
    let pattern = /\d+/g;

    const tabs = $('li:contains("Groups")').text().trim();
    const tabContent = tabs.split(' ');

     // tabcontent 1. dizin sadece rakamı verir.
     if(tabContent.length == 1) totalClan = tabContent[0].match(pattern);
     if(tabContent.length > 1) totalClan = tabContent[1].match(pattern);
  
    console.log("clan sayisi:", totalClan);

    let arr = ["Clan(s): Not a member of any clan."];
    groups.forEach(val => {

    if(val.Clan1) { arr = []; arr.push(`Clan(s): [${val.Clan1}](https://warmerise.com${val.Link1})`); }
    if(val.Clan2) arr.push(`[${val.Clan2}](https://warmerise.com${val.Link2})`);
    if(val.Clan3) arr.push(`[${val.Clan3}](https://warmerise.com${val.Link3})`);
    if(val.Clan4) arr.push(`[${val.Clan4}](https://warmerise.com${val.Link4})`);
    if(val.Clan5) arr.push(`[${val.Clan5}](https://warmerise.com${val.Link5})`);
    
    });

    if(totalClan && totalClan > 5) arr.push(` ${totalClan - 5} more.`); 

    // KLANLAR VE TOPLAM KLAN SAYISI BOLUMU BITER
    
     const created = $(li)
    .find("div[class='generic_layout_container layout_user_profile_info']")
    .find("span[class='timestamp']")
    .last().text();

    const badges = []
    const value = $(li).find("div[class='badge-wrapper']");

    const place = value.find("a").attr('title');
    const link = value.find('a').attr('href');

    if(place) badges.push(`Achievements/Victories:\n[${place}](https://warmerise.com${link})`);


    let footer = `• Joined: ${created}`;
    if(!created) { footer = "• This profile is private."; arr[0] = false; } 

    switch(rank) {
    case "Not ranked yet":
    color = "ORANGE"
    break;

    case "[Banned]":
    rank = "**Banned**";
    color = "RED";
    break;

    case "1":
    rank = "🥇";
    break;

    case "2":
    rank = "🥈";
    break;

    case "3":
    rank = "🥉";
    }

    if(rank >= 4 && rank <= 100) rank = `🏅 ${rank}`;
    if(isApril) rank = "**Banned**"; 
        
    const embed = new MessageEmbed()
    .setColor(color)
    .setDescription(`>>> User Stats\nRank: ${rank}\nXP: ${xp}\nKills: ${kills}\nDeaths: ${deaths}\nKDR: ${kdr}\nHighest Killstreak: ${hk}\nFavourite Weapon: ${weaponStats.mostKills}`)
    .setThumbnail(`https://warmerise.com/${image}`)
    .setFooter({ text: footer });


    console.log("CLANS:", arr);
    // clan section false değilse clanları göster
    if(arr[0] != false) embed.description = `${embed.description}\n${arr.join(' ')}`;
    // badgeler varsa badgeleri göster
    if(badges.length) embed.description = `${embed.description}\n${badges}`;

    let displayMsg;

    Number(userName) ? displayMsg = `${url} (${profileName})` : displayMsg = url;

    constants.interaction.editReply({ content: displayMsg, embeds: [embed] });

    }); // listeItems biter

    });


    // profile bulunamadıysa
    } else {

    let users = [];
    const path = `https://warmerise.com/members?displayname=${userName}`;
    const url = encodeURI(path);

    const request = await fetch(url);
    
    if(request.ok) {
    const html = await request.text().catch(e => {});
    const $ = cheerio.load(html);

    //const result_text = $('body').find("h3").text().trim();
    //console.log("User Sayısı:", result_text);

    // userleri ilk 10'a göre mapla
    // TODO: Kodlar kısaltılacak ve iterasyon uygulanacak.
    const search_results = $('#browsemembers_ul').map((i, element) => ({

        user1: $(element).find('.browsemembers_results_info').eq(0).find('a').text(),
        user2: $(element).find('.browsemembers_results_info').eq(1).find('a').text(),
        user3: $(element).find('.browsemembers_results_info').eq(2).find('a').text(),
        user4: $(element).find('.browsemembers_results_info').eq(3).find('a').text(),
        user5: $(element).find('.browsemembers_results_info').eq(4).find('a').text(),
        user6: $(element).find('.browsemembers_results_info').eq(5).find('a').text(),
        user7: $(element).find('.browsemembers_results_info').eq(6).find('a').text(),
        user8: $(element).find('.browsemembers_results_info').eq(7).find('a').text(),
        user9: $(element).find('.browsemembers_results_info').eq(8).find('a').text(),
        user10: $(element).find('.browsemembers_results_info').eq(9).find('a').text(),
        
        Link1: $(element).find('.browsemembers_results_info').eq(0).find('a').attr('href'),
        Link2: $(element).find('.browsemembers_results_info').eq(1).find('a').attr('href'),
        Link3: $(element).find('.browsemembers_results_info').eq(2).find('a').attr('href'),
        Link4: $(element).find('.browsemembers_results_info').eq(3).find('a').attr('href'),
        Link5: $(element).find('.browsemembers_results_info').eq(4).find('a').attr('href'),
        Link6: $(element).find('.browsemembers_results_info').eq(5).find('a').attr('href'),
        Link7: $(element).find('.browsemembers_results_info').eq(6).find('a').attr('href'),
        Link8: $(element).find('.browsemembers_results_info').eq(7).find('a').attr('href'),
        Link9: $(element).find('.browsemembers_results_info').eq(8).find('a').attr('href'),
        Link10: $(element).find('.browsemembers_results_info').eq(9).find('a').attr('href')
        })).get();


        if(!search_results.length) return constants.interaction.editReply("Could not find requested player.");
        console.log("search:", search_results);

        search_results.forEach((val) => {
        val.user1 ? users.push(`• [${val.user1}](https://warmerise.com${val.Link1})`) : users.push("");
        val.user2 ? users.push(`• [${val.user2}](https://warmerise.com${val.Link2})`) : users.push("");
        val.user3 ? users.push(`• [${val.user3}](https://warmerise.com${val.Link3})`) : users.push("");
        val.user4 ? users.push(`• [${val.user4}](https://warmerise.com${val.Link4})`) : users.push("");
        val.user5 ? users.push(`• [${val.user5}](https://warmerise.com${val.Link5})`) : users.push("");
        val.user6 ? users.push(`• [${val.user6}](https://warmerise.com${val.Link6})`) : users.push("");
        val.user7 ? users.push(`• [${val.user7}](https://warmerise.com${val.Link7})`) : users.push("");
        val.user8 ? users.push(`• [${val.user8}](https://warmerise.com${val.Link8})`) : users.push("");
        val.user9 ? users.push(`• [${val.user9}](https://warmerise.com${val.Link9})`) : users.push("");
        val.user10 ? users.push(`• [${val.user10}](https://warmerise.com${val.Link10})`) : users.push("");

        });


        // embedi gönder
        const embed = new MessageEmbed()
        .setColor('GREEN')
        .addField("Search Results", users.join('\n').toString())
        .setTimestamp();

        constants.interaction.editReply({ embeds: [embed]});
        

    }
    }

    }


}
