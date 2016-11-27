'use strict';

var core = {};
core.InventoryViewModel = require("./inventory/InventoryViewModel");
core.AbilityModel = require("./AbilityModel");
core.BuffViewModel = require("./BuffViewModel");
core.HeroModel = require("./hero/HeroModel");
core.CloneModel = require("./hero/CloneModel");
core.UnitModel = require("./hero/UnitModel");
core.IllusionModel = require("./hero/IllusionModel");
core.Data = require("./data/main");
core.Util = require("./util/main");

core.init = function (HERODATA_PATH, ITEMDATA_PATH, UNITDATA_PATH, callback) {
    core.Data.init(HERODATA_PATH, ITEMDATA_PATH, UNITDATA_PATH, function () {
        core.HeroOptions = require("./hero/heroOptionsArray").init();
        core.BuffOptions = require("./buffs/buffOptionsArray").init();
        core.DebuffOptions = require("./buffs/debuffOptionsArray").init();
        core.ItemOptions = require("./inventory/itemOptionsArray").init();
        core.ItemBuffOptions = require("./inventory/itemBuffOptions").init();
        core.ItemDebuffOptions = require("./inventory/itemDebuffOptions").init();
        callback();
    });
}

module.exports = core;