'use strict';
var HeroModel = require("./HeroModel");

var CloneModel = function (h,p) {
    var self = this;
    HeroModel.call(this, h);
    self.parent = p;
    return self;
}
CloneModel.prototype = Object.create(HeroModel.prototype);
CloneModel.prototype.constructor = CloneModel;

module.exports = CloneModel;