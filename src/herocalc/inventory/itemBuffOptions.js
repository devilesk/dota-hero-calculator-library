var ItemInput = require("./ItemInput");
var itemData = require("../data/main").itemData;
var itemBuffs = ['assault', 'ancient_janggo', 'headdress', 'mekansm', 'pipe', 'ring_of_aquila', 'vladmir', 'ring_of_basilius', 'buckler', 'solar_crest'];
var itemBuffOptions = {};

var init = function () {
    itemBuffOptions.items = itemBuffs.map(function(item) {
        return new ItemInput(item, itemData['item_' + item].displayname);
    });
    return itemBuffOptions.items;
}

itemBuffOptions.init = init;

module.exports = itemBuffOptions;