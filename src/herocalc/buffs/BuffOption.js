var findWhere = require("../util/findWhere");
var heroData = require("../hero/heroData");
var unitData = require("../data/unitdata.json");

var BuffOption = function (hero, ability) {
    this.buffName = ability;
    if (heroData['npc_dota_hero_' + hero] == undefined) {
        this.hero = hero;
        this.abilityData = findWhere(unitData[hero].abilities, {name: ability})
        this.buffDisplayName = unitData[hero].displayname + ' - ' + this.abilityData.displayname;
    }
    else {
        this.hero = 'npc_dota_hero_' + hero;
        this.abilityData = findWhere(heroData['npc_dota_hero_' + hero].abilities, {name: ability})
        this.buffDisplayName = heroData['npc_dota_hero_' + hero].displayname + ' - ' + this.abilityData.displayname;        
        if (ability == 'sven_gods_strength') {
            this.buffDisplayName += ' (Aura for allies)';
        }
    }

};

module.exports = BuffOption;