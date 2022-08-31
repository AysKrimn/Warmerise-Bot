// @Warmerise Fav Weapon Stats

function stats($) {
/* eq(0) silah adi eq(2) öldürmeler eq(3) ise silah xp'sine eşit */

 let output = {};

 const freeContent = $('tbody').eq(1);
 const f_weaponName = freeContent.find('tr td').eq(0).text()
 const f_weaponKills = Number(freeContent.find('tr td').eq(2).text())


 const purchasedContent = $('tbody').last();
 const p_weaponName = purchasedContent.find('tr td').eq(0).text()
 const p_weaponKills = Number(purchasedContent.find('tr td').eq(2).text())

 if(f_weaponKills > p_weaponKills) output.mostKills = f_weaponName
 else output.mostKills = p_weaponName
 

 if(f_weaponKills > 100 || p_weaponKills > 100) return output

 else {
 output.mostKills = "Not yet calculated"
 return output

 }


    
    
}
    
    
    
    
module.exports = stats;
