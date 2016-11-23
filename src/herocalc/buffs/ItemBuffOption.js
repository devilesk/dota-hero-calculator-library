var findWhere = require("../util/findWhere");
var heroData = require("./hero/heroData");
var unitData = require("./data/unitdata.json");

var ItemBuffOption = function (item) {
    this.buffName = item;
    if (heroData['npc_dota_hero_' + hero] == undefined) {
        this.hero = hero;
        this.abilityData = findWhere(unitData[hero].abilities, {name: item})
        this.buffDisplayName = unitData[hero].displayname + ' - ' + this.abilityData.displayname;        
    }
    else {
        this.hero = 'npc_dota_hero_' + hero;
        this.abilityData = findWhere(heroData['npc_dota_hero_' + hero].abilities, {name: item})
        this.buffDisplayName = heroData['npc_dota_hero_' + hero].displayname + ' - ' + this.abilityData.displayname;        
    }
};

module.exports = ItemBuffOption;