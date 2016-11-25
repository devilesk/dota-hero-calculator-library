var validItems = require("./validItems");
var ItemInput = require("./ItemInput");
var itemData = require("../data/main").itemData;

var itemOptionsArr = [];

for (var i = 0; i < validItems.length; i++) {
    itemOptionsArr.push(new ItemInput(validItems[i], itemData['item_' + validItems[i]].displayname));
}
        
module.exports = itemOptionsArr;