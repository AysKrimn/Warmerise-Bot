// @Warmerise Fav Weapon Stats

function stats(tableContent) {
    const output = {};
    const asArray = tableContent.replace(/(\t|\n)/gm, ' ').split(' ').filter(d => d);
    console.log("Fonksiyon:", asArray);
    
    const freeItems = asArray.indexOf('Free');
    const purchasedItems = asArray.indexOf('Purchased');
    
    /*
    favoriteWeapons = silahların ismi alttakiler ise kill-count.
    MFX = Most Free XP
    MPX = Most Purchased XP
    */
    let favouriteFreeWeapon = asArray[freeItems + 4];
    let MFX = asArray[freeItems + 5];
    
    let favouritePurchasedWeapon = asArray[purchasedItems + 4];
    let MPX = asArray[purchasedItems + 5];
    
    switch(favouriteFreeWeapon) {
    case "UMP":
    favouriteFreeWeapon = "UMP 40"; 
    MFX = asArray[freeItems + 6];
    break;
    
    case "Vector":
    favouriteFreeWeapon = "Vector X";
    MFX = asArray[freeItems + 6];
    break;
    
    case "Blast":
    favouriteFreeWeapon = "Blast Shotgun";
    MFX = asArray[freeItems + 6];
    }
    
    output['FreeWeapon'] = favouriteFreeWeapon;
    output['FXP'] = MFX;
    
    // eğer satın alınmış silahlar varsa
    if(favouritePurchasedWeapon) {
    
    switch(favouritePurchasedWeapon) {
    
    case "Vector":
    favouritePurchasedWeapon = "Vector X";
    MPX = asArray[purchasedItems + 6];
    break;
    
    case "Blast":
    favouritePurchasedWeapon = "Blast Shotgun";
    MPX = asArray[purchasedItems + 6];
    
    }
    
    output['PurchasedWeapon'] = favouritePurchasedWeapon
    output['PXP'] = MPX;
    }
      
    if(!favouritePurchasedWeapon) MPX = '0';
      
    console.log("F:", favouriteFreeWeapon, "P:", favouritePurchasedWeapon);
    
      
    // fav silahi ayarla
    if(Number(MFX) > 100 || Number(MPX) > 100)  {
    if(Number(MFX) > Number(MPX)) output.mostKills = favouriteFreeWeapon;
    else output.mostKills = favouritePurchasedWeapon;
    
    } else output.mostKills = "Not yet calculated.";
    
    
    return output;
    
    }
    
    
    
    
    module.exports = stats;