// user id
// scriptlerden userIdsini çek
const parseScripts = ($) => {

    let userId = null;

    $('head script').not('src').each(function(index, element) {

        

        if(index == 4) {

        const content = element.children[0].data;
        const pattern =  /\d+/g;
        userId = content.match(pattern);
        // console.log("önce:" , userId)
        // userId döndür
        userId = userId[userId.length -3];
        }

    })


    return userId;

}





module.exports = parseScripts