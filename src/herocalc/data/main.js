var HeroCalcData = {
    heroData: {},
    itemData: {},
    unitData: {},
    heroDataReady: false,
    itemDataReady: false,
    unitDataReady: false
};
var getJSON = require("../util/getJSON");
var extend = function(out) {
  out = out || {};

  for (var i = 1; i < arguments.length; i++) {
    if (!arguments[i])
      continue;

    for (var key in arguments[i]) {
      if (arguments[i].hasOwnProperty(key))
        out[key] = arguments[i][key];
    }
  }

  return out;
};

var resourceCounter = 0;

var onResourceLoaded = function (callback) {
    resourceCounter--;
    if (resourceCounter === 0) {
        if (callback) callback();
    }
}

var init = function (HERODATA_PATH, ITEMDATA_PATH, UNITDATA_PATH, callback) {
    resourceCounter = 0;
    if (HERODATA_PATH) resourceCounter++;
    if (ITEMDATA_PATH) resourceCounter++;
    if (UNITDATA_PATH) resourceCounter++;
    
    if (!HeroCalcData.heroDataReady) {
        if (HERODATA_PATH) {
            getJSON(HERODATA_PATH, function (heroData) {
                extend(HeroCalcData.heroData, heroData);
                HeroCalcData.heroDataReady = true;
                heroData['npc_dota_hero_chen'].abilities[2].behavior.push('DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE');
                heroData['npc_dota_hero_nevermore'].abilities[1].behavior.push('DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE');
                heroData['npc_dota_hero_nevermore'].abilities[2].behavior.push('DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE');
                heroData['npc_dota_hero_morphling'].abilities[3].behavior.push('DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE');
                heroData['npc_dota_hero_ogre_magi'].abilities[3].behavior.push('DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE');
                heroData['npc_dota_hero_techies'].abilities[4].behavior.push('DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE');
                heroData['npc_dota_hero_beastmaster'].abilities[2].behavior.push('DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE');

                var index = heroData['npc_dota_hero_lone_druid'].abilities[3].behavior.indexOf('DOTA_ABILITY_BEHAVIOR_HIDDEN');
                heroData['npc_dota_hero_lone_druid'].abilities[3].behavior.splice(index, 1);

                index = heroData['npc_dota_hero_abaddon'].abilities[2].behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE');
                heroData['npc_dota_hero_abaddon'].abilities[2].behavior.splice(index, 1);

                index = heroData['npc_dota_hero_riki'].abilities[2].behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE');
                heroData['npc_dota_hero_riki'].abilities[2].behavior.splice(index, 1);
                
                onResourceLoaded(callback);
            });
        }
    }
    if (!HeroCalcData.itemDataReady) {
        if (ITEMDATA_PATH) {
            getJSON(ITEMDATA_PATH, function (data) {
                extend(HeroCalcData.itemData, data);
                HeroCalcData.itemDataReady = true;
                onResourceLoaded(callback);
            });
        }
    }
    if (!HeroCalcData.unitDataReady) {
        if (UNITDATA_PATH) {
            getJSON(UNITDATA_PATH, function (data) {
                extend(HeroCalcData.unitData, data);
                HeroCalcData.unitDataReady = true;
                onResourceLoaded(callback);
            });
        }
    }
}
    
HeroCalcData.init = init;

module.exports = HeroCalcData;