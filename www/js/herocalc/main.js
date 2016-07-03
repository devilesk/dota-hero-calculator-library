define(function (require, exports, module) {
    'use strict';

    var core = require("./herocalc_core");
    require("./herocalc_inventory");
    require("./herocalc_tooltips");
    require("./herocalc_abilitydata");
    require("./herocalc_abilities");
    require("./herocalc_buffs");
    require("./herocalc_buffs.amplification.reduction");
    require("./herocalc_buildexplorer");
    require("./herocalc_hero");
    require("./herocalc_hero.illusion");
    require("./herocalc_hero.meepo");
    require("./herocalc_unit");
    require("./herocalc_app");
    //require("./knockout-binding-report");

    exports.HEROCALCULATOR = core.HEROCALCULATOR;
});