var ItemInput = require("./ItemInput");
var itemBuffs = ['assault', 'ancient_janggo', 'headdress', 'mekansm', 'pipe', 'ring_of_aquila', 'vladmir', 'ring_of_basilius', 'buckler', 'solar_crest'];
var itemBuffOptions = {};

var init = function (itemData) {
    itemBuffOptions.items = itemBuffs.map(function(item) {
        return new ItemInput(itemData, item, itemData['item_' + item].displayname);
    });
    return itemBuffOptions.items;
}

itemBuffOptions.init = init;

module.exports = itemBuffOptions;