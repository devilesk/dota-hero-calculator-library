var ItemInput = require("./ItemInput");
var itemData = require("../data/itemdata.json");
var itemBuffs = ['assault', 'ancient_janggo', 'headdress', 'mekansm', 'pipe', 'ring_of_aquila', 'vladmir', 'ring_of_basilius', 'buckler', 'solar_crest'];
var itemBuffOptions = itemBuffs.map(function(item) {
    return new ItemInput(item, itemData['item_' + item].displayname);
});

module.exports = itemBuffOptions;