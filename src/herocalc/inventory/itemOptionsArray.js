var validItems = require("./validItems");
var ItemInput = require("./ItemInput");
var itemData = require("../data/main").itemData;

var itemOptionsArray = {};

var init = function () {
    itemOptionsArray.items = [];
    for (var i = 0; i < validItems.length; i++) {
        itemOptionsArray.items.push(new ItemInput(validItems[i], itemData['item_' + validItems[i]].displayname));
    }
    return itemOptionsArray.items;
}

itemOptionsArray.init = init;

module.exports = itemOptionsArray;