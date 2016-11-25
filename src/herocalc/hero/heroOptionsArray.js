var heroData = require("../data/main").heroData;
var HeroOption = require("./HeroOption");

var heroOptionsArray = [];
for (var h in heroData) {
    heroOptionsArray.push(new HeroOption(h.replace('npc_dota_hero_', ''), heroData[h].displayname));
}

module.exports = heroOptionsArray;