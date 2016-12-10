(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.HeroCalc = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var ko = require('./herocalc_knockout');
var abilityData = require("./herocalc_abilitydata");

var AbilityModel = function (a, h) {
    var self = this;
    self.hero = h;
    self.abilityData = abilityData;
    self.hasScepter = ko.observable(false);
    self.isShapeShiftActive = ko.observable(false);
    self.abilities = a;
    self._abilities = self.abilities();
    for (var i = 0; i < self.abilities().length; i++) {
        self._abilities[i].level = ko.observable(0);
        self._abilities[i].isActive = ko.observable(false);
        self._abilities[i].isDetail = ko.observable(false);
        self._abilities[i].baseDamage = ko.observable(0);
        self._abilities[i].baseDamageReductionPct = ko.observable(0);
        self._abilities[i].baseDamageMultiplier = ko.observable(0);
        self._abilities[i].bash = ko.observable(0);
        self._abilities[i].bashBonusDamage = ko.observable(0);
        self._abilities[i].bonusDamage = ko.observable(0);
        self._abilities[i].bonusDamageOrb = ko.observable(0);
        self._abilities[i].bonusDamagePct = ko.observable(0);
        self._abilities[i].bonusDamagePrecisionAura = ko.observable(0);
        self._abilities[i].bonusDamageReduction = ko.observable(0);
        self._abilities[i].bonusHealth = ko.observable(0);
        self._abilities[i].bonusStrength = ko.observable(0);
        self._abilities[i].bonusStrength2 = ko.observable(0);
        self._abilities[i].bonusAgility = ko.observable(0);
        self._abilities[i].bonusAgility2 = ko.observable(0);
        self._abilities[i].bonusInt = ko.observable(0);
        self._abilities[i].bonusAllStatsReduction = ko.observable(0);
        self._abilities[i].damageAmplification = ko.observable(0);
        self._abilities[i].damageReduction = ko.observable(0);
        self._abilities[i].evasion = ko.observable(0);
        self._abilities[i].magicResist = ko.observable(0);
        self._abilities[i].manaregen = ko.observable(0);
        self._abilities[i].manaregenreduction = ko.observable(0);
        self._abilities[i].missChance = ko.observable(0);
        self._abilities[i].movementSpeedFlat = ko.observable(0);
        self._abilities[i].movementSpeedPct = ko.observable(0);
        self._abilities[i].movementSpeedPctReduction = ko.observable(0);
        self._abilities[i].turnRateReduction = ko.observable(0);
        self._abilities[i].attackrange = ko.observable(0);
        self._abilities[i].attackspeed = ko.observable(0);
        self._abilities[i].attackspeedreduction = ko.observable(0);
        self._abilities[i].armor = ko.observable(0);
        self._abilities[i].armorReduction = ko.observable(0);
        self._abilities[i].healthregen = ko.observable(0);
        self._abilities[i].lifesteal = ko.observable(0);
        self._abilities[i].visionnight = ko.observable(0);
        self._abilities[i].visionday = ko.observable(0);
    }
    self.abilityControlData = {};
    self.abilitySettingsData = function (data, parent, index) {
        if (self.abilityControlData[data] == undefined) {
            return self.processAbility(data, parent, index, self.abilityData[data]);
        }
        else {
            return self.abilityControlData[data];
        }
    }
    
    self.processAbility = function (data, parent, index, args) {
        var result = {};
        result.data = [];
        var v;
        var v_list = [];
        for (var i=0; i < args.length; i++) {
            switch (args[i].controlType) {
                case 'input':
                    v = ko.observable(0).extend({ numeric: 2 });
                    v.controlValueType = args[i].controlValueType;
                    v_list.push(v);
                    result.data.push({ labelName: args[i].label.toUpperCase() + ':', controlVal: v, controlType: args[i].controlType, display: args[i].display });
                break;
                case 'checkbox':
                    v = ko.observable(false);
                    v.controlValueType = args[i].controlValueType;
                    v_list.push(v);
                    result.data.push({ labelName: args[i].label.toUpperCase() + '?', controlVal: v, controlType: args[i].controlType, display: args[i].display });
                break;
                case 'radio':
                    v = ko.observable(args[i].controlOptions[0].value);
                    v.controlValueType = args[i].controlValueType;
                    v_list.push(v);
                    result.data.push({ labelName: args[i].label.toUpperCase() + '?', controlVal: v, controlType: args[i].controlType, display: args[i].display, controlOptions: args[i].controlOptions });
                break;
                case 'method':
                case 'text':
                    // single input abilities
                    if (args[i].controls == undefined) {
                        if (args[i].noLevel) {
                            var attributeValue = function (attributeName) {
                                return {fn: ko.computed(function () {
                                    var _ability = self.abilities().find(function(b) {
                                        return b.name == data;
                                    });
                                    return self.getAbilityAttributeValue(_ability.attributes, attributeName, 0);
                                })};
                            };
                        }
                        else {
                            var attributeValue = function (attributeName) {
                                return {fn: ko.computed(function () {
                                    var _ability = self.abilities().find(function(b) {
                                        return b.name == data;
                                    });
                                    return self.getAbilityAttributeValue(_ability.attributes, attributeName, _ability.level());
                                })};
                            };
                        }
                        var g = attributeValue(args[i].attributeName)
                        var r = self.getComputedFunction(v, g.fn, args[i].fn, parent, index, self, args[i].returnProperty, undefined, data);
                        if (args[i].ignoreTooltip) {
                            var tooltip = args[i].label || args[i].attributeName;
                        }
                        else {
                            var tooltip = self.getAbilityAttributeTooltip(self.abilities()[index].attributes, args[i].attributeName) || args[i].label || args[i].attributeName;
                        }
                        result.data.push({ labelName: tooltip.toUpperCase(), controlVal: r, controlType: args[i].controlType, display: args[i].display, clean: g.fn });
                    }
                    // multi input abilities
                    else {
                        if (args[i].noLevel) {
                            var attributeValue = function (attributeName) {
                                return {fn: ko.computed(function () {
                                    return self.getAbilityAttributeValue(self.abilities()[index].attributes, attributeName, 0);
                                })};
                            };
                        }
                        else {
                            var attributeValue = function (attributeName) {
                                return {fn: ko.computed(function () {
                                    return self.getAbilityAttributeValue(self.abilities()[index].attributes, attributeName, self.abilities()[index].level());
                                })};
                            };
                        }
                        var g = attributeValue(args[i].attributeName)
                        var r = self.getComputedFunction(v_list, g.fn, args[i].fn, parent, index, self, args[i].returnProperty, args[i].controls, data);
                        if (args[i].ignoreTooltip) {
                            var tooltip = args[i].label || args[i].attributeName;
                        }
                        else {
                            var tooltip = self.getAbilityAttributeTooltip(self.abilities()[index].attributes, args[i].attributeName) || args[i].label || args[i].attributeName;
                        }
                        result.data.push({ labelName: tooltip.toUpperCase(), controlVal: r, controlType: args[i].controlType, display: args[i].display, clean: g.fn });
                    }
                    
                    if (args[i].controlType == 'method') {
                        v_list.push(r);
                    }
                break;
            }
        }
        self.abilityControlData[data] = result;
        return result;
    }

    self.getComputedFunction = function (v, attributeValue, fn, parent, index, abilityModel, returnProperty, controls, abilityName) {
        var _ability = abilityModel.abilities().find(function(b) {
            return b.name == abilityName;
        });
        return ko.pureComputed(function () {                
            var inputValue;
            if (controls == undefined) {
                if (v == undefined) {
                    inputValue = v;
                }
                else if (typeof v() == 'boolean') {
                    inputValue = v();
                }
                else if (v.controlValueType == undefined) {
                    inputValue = parseFloat(v());
                }
                else if (v.controlValueType == 'string') {
                    inputValue = v();
                }
                else {
                    inputValue = parseFloat(v());
                }
            }
            else {
                var v_list = [];
                for (var i=0;i<controls.length;i++) {
                    switch (typeof v[controls[i]]()) {
                        case 'boolean':
                        case 'object':
                            v_list.push(v[controls[i]]());
                        break;
                        default:
                            v_list.push(parseFloat(v[controls[i]]()));
                        break;
                    }
                }
                inputValue = v_list;
            }
            
            var returnVal = fn.call(this, inputValue, attributeValue(), parent, index, abilityModel, _ability);
            if (returnProperty != undefined) {
                _ability[returnProperty](returnVal);
            }
            return returnVal;
        }, this);
    }
    
    self.getAbilityLevelByAbilityName = function (abilityName) {
        for (var i = 0; i < self.abilities().length; i++) {
            if (self._abilities[i].name == abilityName) {
                return self._abilities[i].level();
            }
        }
        return -1;
    }

    self.getAbilityByName = function (abilityName) {
        for (var i = 0; i < self.abilities().length; i++) {
            if (self._abilities[i].name == abilityName) {
                return self._abilities[i];
            }
        }
        return undefined;
    }

    self.getAbilityPropertyValue = function (ability, property) {
        return parseFloat(ability[property]()[ability.level()-1]);
    }
    
    self.getAttributeBonusLevel = function () {
        for (var i = 0; i < self.abilities().length; i++) {
            if (self._abilities[i].name == 'attribute_bonus') {
                return self._abilities[i].level();
            }
        }
        return 0;        
    }
    
    self.getAllStatsReduction = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {                    
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        /*switch(attribute.name) {
                            // invoker_quas
                            case 'bonus_strength':
                                totalAttribute += parseInt(attribute.value[ability.level()-1]);
                            break;
                        }*/
                    }
                }
                else if (ability.bonusAllStatsReduction != undefined) {
                    // slark_essence_shift
                    totalAttribute+=ability.bonusAllStatsReduction();
                }
            }
        }
        return totalAttribute;
    });
    
    self.getStrengthReduction = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {                    
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        /*switch(attribute.name) {
                            // invoker_quas
                            case 'bonus_strength':
                                totalAttribute += parseInt(attribute.value[ability.level()-1]);
                            break;
                        }*/
                    }
                }
                else if (ability.bonusStrength != undefined && ability.name == 'undying_decay') {
                    // undying_decay
                    totalAttribute-=ability.bonusStrength();
                }
            }
        }
        return totalAttribute;
    });
    
    self.getStrength = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0) {
                if (!(ability.name in self.abilityData)) {
                    if (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1)) {
                        for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                            var attribute = self._abilities[i].attributes[j];
                            /*switch(attribute.name) {
                                // invoker_quas
                                case 'bonus_strength':
                                    totalAttribute += parseInt(attribute.value[ability.level()-1]);
                                break;
                            }*/
                        }
                    }
                }
                else {
                    if (ability.bonusStrength != undefined) {
                        if (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1) || ability.name == 'invoker_quas') {
                            // pudge_flesh_heap,invoker_quas,morphling_morph_str,morphling_morph_agi,undying_decay
                            totalAttribute+=ability.bonusStrength();
                        }
                    }
                    if (ability.bonusStrength2 != undefined) {
                        if (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1)) {
                            // morphling_morph_str
                            totalAttribute+=ability.bonusStrength2();
                        }
                    }
                }
            }
        }
        return totalAttribute;
    });
    
    self.getAgility = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0) {
                if (!(ability.name in self.abilityData)) {
                    if (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1)) {
                        for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                            var attribute = self._abilities[i].attributes[j];
                            switch(attribute.name) {
                                // drow_ranger_marksmanship
                                case 'marksmanship_agility_bonus':
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                break;
                            }
                        }
                    }
                }
                else {
                    if (ability.bonusAgility != undefined) {
                        if (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1) || ability.name == 'invoker_wex') {
                            // invoker_wex,morphling_morph_agi,morphling_morph_str
                            totalAttribute+=ability.bonusAgility();
                        }
                    }
                    if (ability.bonusAgility2 != undefined) {
                        if (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1)) {
                            // invoker_wex,morphling_morph_agi,morphling_morph_str
                            totalAttribute+=ability.bonusAgility2();
                        }
                    }
                }
            }
        }
        return totalAttribute;
    });

    self.getIntelligence = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0) {
                if (!(ability.name in self.abilityData)) {
                    if (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1)) {
                        for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                            var attribute = self._abilities[i].attributes[j];
                            switch(attribute.name) {
                                // invoker_exort
                            /*    case 'bonus_intelligence':
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                break;*/
                            }
                        }
                    }
                }
                else if (ability.bonusInt != undefined) {
                    if (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1) || ability.name == 'invoker_exort') {
                        // invoker_exort
                        totalAttribute+=ability.bonusInt();
                    }
                }
            }
        }
        return totalAttribute;
    });
    
    self.getArmor = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // axe_berserkers_call,dragon_knight_dragon_blood,troll_warlord_berserkers_rage,lycan_shapeshift,enraged_wildkin_toughness_aura
                            case 'bonus_armor':
                                if (ability.name != 'templar_assassin_meld') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                }
                            break;
                            // sven_warcry
                            case 'warcry_armor':
                                totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                            break;
                            // lich_frost_armor,ogre_magi_frost_armor
                            case 'armor_bonus':
                                if (ability.name == 'lich_frost_armor' || ability.name == 'ogre_magi_frost_armor') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                }
                            break;
                        }
                    }
                }
                else if (ability.armor != undefined) {
                    // shredder_reactive_armor,visage_gravekeepers_cloak
                    totalAttribute+=ability.armor();
                }
            }
        }
        return totalAttribute;
    });

    self.getArmorBaseReduction = ko.computed(function () {
        var totalAttribute = 1;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                //if (!(ability.name in self.abilityData)) {
                    switch(ability.name) {
                        //elder_titan_natural_order
                        case 'elder_titan_natural_order':
                            totalAttribute *= (1-self.getAbilityAttributeValue(self._abilities[i].attributes, 'armor_reduction_pct', ability.level())/100);
                        break;
                    }
                //}
            }
        }
        return totalAttribute;
    });
    
    self.getArmorReduction = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    switch(ability.name) {
                        //templar_assassin_meld
                        case 'templar_assassin_meld':
                            totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, 'bonus_armor', ability.level());
                        break;
                        // tidehunter_gush
                        case 'tidehunter_gush':
                            totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, 'armor_bonus', ability.level());
                        break;
                        // naga_siren_rip_tide
                        case 'naga_siren_rip_tide':
                        // slardar_amplify_damage
                        case 'slardar_amplify_damage':
                        // vengefulspirit_wave_of_terror
                        case 'vengefulspirit_wave_of_terror':
                            totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, 'armor_reduction', ability.level());
                        break;
                        // nevermore_dark_lord
                        case 'nevermore_dark_lord':
                            totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, 'presence_armor_reduction', ability.level());
                        break;
                    }
                }
                else if (ability.armorReduction != undefined) {
                    // alchemist_acid_spray
                    totalAttribute+=ability.armorReduction();
                }
            }
        }
        return totalAttribute;
    });

    self.getHealth = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // lone_druid_true_form,lycan_shapeshift,troll_warlord_berserkers_rage
                            case 'bonus_hp':
                                totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                            break;
                            // lone_druid_synergy
                            case 'true_form_hp_bonus':
                                if (self.isTrueFormActive()) {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                }
                            break;
                        }
                    }
                }
                else if (ability.bonusHealth != undefined) {
                    // clinkz_death_pact
                    totalAttribute+=ability.bonusHealth();
                }
            }
        }
        return totalAttribute;
    });
    
    self.isTrueFormActive = function () {
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.isActive() && ability.name == 'lone_druid_true_form') {
                return true;
            }
        }
        return false;
    }

    self.getHealthRegen = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // alchemist_chemical_rage, dragon_knight_dragon_blood
                            case 'bonus_health_regen':
                            // broodmother_spin_web
                            case 'heath_regen':
                            // omniknight_guardian_angel,treant_living_armor,satyr_hellcaller_unholy_aura
                            case 'health_regen':
                                totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                            break;
                            // legion_commander_press_the_attack
                            case 'hp_regen':
                                totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                            break;
                        }
                    }
                }
                else if (ability.healthregen != undefined) {
                    // shredder_reactive_armor,invoker_quas,necrolyte_sadist
                    totalAttribute+=ability.healthregen();
                }
            }
        }
        return totalAttribute;
    });

    self.getMana = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                //if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // obsidian_destroyer_essence_aura
                            case 'bonus_mana':
                                totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                            break;
                        }
                    }
                //}
            }
        }
        return totalAttribute;
    });
    
    self.getManaRegen = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // alchemist_chemical_rage
                            case 'bonus_mana_regen':
                                totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                            break;
                        }
                    }
                }
                else if (ability.manaregen != undefined) {
                    // necrolyte_sadist
                    totalAttribute+=ability.manaregen();
                }
            }
        }
        return totalAttribute;
    });
    
    self.getManaRegenArcaneAura = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                //if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // crystal_maiden_brilliance_aura
                            case 'mana_regen':
                                if (ability.name == 'crystal_maiden_brilliance_aura') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                }
                            break;
                        }
                    }
                //}
            }
        }
        return totalAttribute;
    });

    self.getManaRegenReduction = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                /*if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        //switch(attribute.name) {
                        //    // 
                        //    case '':
                        //        totalAttribute += parseInt(attribute.value[ability.level()-1]);
                        //    break;
                        //}
                    }
                }
                else*/ if (ability.manaregenreduction != undefined) {
                    // pugna_nether_ward
                    totalAttribute+=ability.manaregenreduction();
                }
            }
        }
        return totalAttribute;
    });
    
    self.getAttackRange = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0) {
                if (!(ability.name in self.abilityData)) {
                    if (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1)) {
                        for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                            var attribute = self._abilities[i].attributes[j];
                            switch(attribute.name) {
                                // winter_wyvern_arctic_burn
                                case 'attack_range_bonus':
                                // templar_assassin_psi_blades,sniper_take_aim
                                case 'bonus_attack_range':
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                break;
                                // terrorblade_metamorphosis,troll_warlord_berserkers_rage
                                case 'bonus_range':
                                    if (ability.name == 'terrorblade_metamorphosis') {
                                        totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                    }
                                    if (ability.name == 'troll_warlord_berserkers_rage') {
                                        totalAttribute -= self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                    }
                                break;
                                // tiny_grow
                                case 'bonus_range_scepter':
                                    if (ability.name == 'tiny_grow' && self.hasScepter()) {
                                        totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                    }
                                break;
                                // enchantress_impetus
                                case 'bonus_attack_range_scepter':
                                    if (ability.name == 'enchantress_impetus' && self.hasScepter()) {
                                        totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                    }
                                break;
                            }
                        }
                        // lone_druid_true_form
                        if (ability.name == 'lone_druid_true_form') {
                            totalAttribute -= 422;
                        }
                    }
                    else if (ability.name == 'enchantress_impetus' && self.hasScepter()) {
                        for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                            var attribute = self._abilities[i].attributes[j];
                            switch(attribute.name) {
                              case 'bonus_attack_range_scepter':
                                totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                              break;
                            }
                        }
                    }
                }
                else if (ability.attackrange != undefined) {
                    if (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1)) {
                        // dragon_knight_elder_dragon_form
                        totalAttribute+=ability.attackrange();
                    }
                }
            }
        }
        return totalAttribute;
    });
    
    self.getAttackSpeed = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // abaddon_frostmourne,troll_warlord_battle_trance
                            case 'attack_speed':
                            // visage_grave_chill
                            case 'attackspeed_bonus':
                            // mirana_leap
                            case 'leap_speedbonus_as':
                            // life_stealer
                            case 'attack_speed_bonus':
                                totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                            break;
                            // clinkz_strafe,ursa_overpower
                            case 'attack_speed_bonus_pct':
                                if (ability.name == 'clinkz_strafe' || ability.name == 'ursa_overpower') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                }
                            break;
                            // axe_culling_blade,necronomicon_archer_aoe
                            case 'speed_bonus':
                                if (ability.name == 'axe_culling_blade' || ability.name == 'necronomicon_archer_aoe') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                }
                            break;
                            // ancient_apparition_chilling_touch
                            case 'attack_speed_pct':
                                if (ability.name == 'ancient_apparition_chilling_touch') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                }
                            break;
                            // beastmaster_inner_beast,lycan_feral_impulse,lone_druid_rabid,tiny_grow,phantom_assassin_phantom_strike,windrunner_focusfire,ogre_magi_bloodlust,centaur_khan_endurance_aura
                            case 'bonus_attack_speed':
                                if (ability.name == 'beastmaster_inner_beast' 
                                 || ability.name == 'lycan_feral_impulse' 
                                 || ability.name == 'lone_druid_rabid' 
                                 || ability.name == 'tiny_grow' 
                                 || ability.name == 'phantom_assassin_phantom_strike' 
                                 || ability.name == 'windrunner_focusfire' 
                                 || ability.name == 'ogre_magi_bloodlust'
                                 || ability.name == 'centaur_khan_endurance_aura') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                }
                            break;
                        }
                    }
                }
                else if (ability.attackspeed != undefined) {
                    // troll_warlord_fervor,wisp_overcharge,lina_fiery_soul,invoker_alacrity,invoker_wex,huskar_berserkers_blood
                    totalAttribute+=ability.attackspeed();
                }
            }
        }
        return totalAttribute;
    });

    self.getAttackSpeedReduction = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // night_stalker_void,crystal_maiden_crystal_nova,ghost_frost_attack,ogre_magi_frost_armor,polar_furbolg_ursa_warrior_thunder_clap
                            case 'attackspeed_slow':
                            // lich_frost_armor,lich_frost_nova,enchantress_untouchable
                            case 'slow_attack_speed':
                            // beastmaster_primal_roar
                            case 'slow_attack_speed_pct':
                            // storm_spirit_overload
                            case 'overload_attack_slow':
                                totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                            break;
                            // omniknight_degen_aura
                            case 'speed_bonus':
                                if (ability.name == 'omniknight_degen_aura') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                }
                            break;
                            // tusk_frozen_sigil,crystal_maiden_freezing_field
                            case 'attack_slow':
                                if (ability.name == 'crystal_maiden_freezing_field' && !self.hasScepter()) {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                }
                                else if (ability.name == 'tusk_frozen_sigil') {
                                    totalAttribute -= self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                }
                            break;
                            case 'attack_slow_scepter':
                                if (ability.name == 'crystal_maiden_freezing_field' && self.hasScepter()) {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                }
                            break;
                            // faceless_void_time_walk
                            case 'attack_speed_pct':
                                if (ability.name == 'faceless_void_time_walk') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                }
                            break;
                            // bounty_hunter_jinada
                            case 'bonus_attackspeed':
                                if (ability.name == 'bounty_hunter_jinada') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                }
                            break;
                            // brewmaster_thunder_clap
                            case 'attack_speed_slow':
                                if (ability.name == 'brewmaster_thunder_clap') {
                                    totalAttribute -= self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                }
                            break;
                            // medusa_stone_gaze
                            case 'slow':
                                if (ability.name == 'medusa_stone_gaze') {
                                    totalAttribute -= self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                }
                            break;
                            // visage_grave_chill
                            case 'attackspeed_bonus':
                                totalAttribute -= self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                            break;
                            // abaddon_frostmourne
                            case 'attack_slow_tooltip':
                                if (ability.name == 'abaddon_frostmourne') {
                                    totalAttribute -= self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                }
                            break;
                        }
                    }
                    if (ability.name == 'enraged_wildkin_tornado') {
                        totalAttribute -= 15;
                    }
                }
                else if (ability.attackspeedreduction != undefined) {
                    // viper_viper_strike,viper_corrosive_skin,jakiro_liquid_fire,lich_chain_frost,sandking_epicenter,earth_spirit_rolling_boulder
                    totalAttribute+=ability.attackspeedreduction();
                }
            }
        }
        return totalAttribute;
    });
    self.getBash = ko.computed(function () {
        var totalAttribute = 1;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // slardar_bash
                            case 'chance':
                            // sniper_headshot
                            case 'proc_chance':
                                totalAttribute *= (1 - self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100);
                            break;
                        }
                    }
                }
                else if (ability.bash != undefined) {
                    // spirit_breaker_greater_bash,faceless_void_time_lock
                    totalAttribute *= (1 - ability.bash()/100);
                }
            }
        }
        return totalAttribute;
    });    
    self.getBaseDamage = ko.computed(function () {
        var totalAttribute = 0;
        var totalMultiplier = 1;
        var sources = {};
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // tiny_grow,terrorblade_metamorphosis
                            case 'bonus_damage':
                                if (ability.name == 'tiny_grow' || ability.name == 'terrorblade_metamorphosis') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                    sources[ability.name] = {
                                        'damage': self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level()),
                                        'damageType': 'physical',
                                        'displayname': ability.displayname
                                    }
                                }
                            break;
                        }
                    }
                }
                else {
                    if (ability.baseDamageMultiplier != undefined) {
                        // earthshaker_enchant_totem
                        totalMultiplier += ability.baseDamageMultiplier()/100;
                        /*totalAttribute += ability.baseDamage();
                        sources[ability.name] = {
                            'damage': ability.baseDamage(),
                            'damageType': 'physical',
                            'displayname': ability.displayname
                        }*/
                    }
                    if (ability.baseDamage != undefined) {
                        // clinkz_death_pact
                        totalAttribute += ability.baseDamage();
                        sources[ability.name] = {
                            'damage': ability.baseDamage(),
                            'damageType': 'physical',
                            'displayname': ability.displayname
                        }
                    }
                }
            }
        }
        return { sources: sources, total: totalAttribute, multiplier: totalMultiplier };
    });
    
    self.getSelfBaseDamageReductionPct = ko.computed(function () {
        var totalAttribute = 1;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // medusa_split_shot
                            case 'damage_modifier':
                                totalAttribute *= (1 + self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100);
                            break;
                            // windrunner_focusfire
                            case 'focusfire_damage_reduction':
                                if (!self.hasScepter()) {
                                    totalAttribute *= (1 + self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100);
                                }
                            break;
                            case 'focusfire_damage_reduction_scepter':
                                if (self.hasScepter()) {
                                    totalAttribute *= (1 + self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100);
                                }
                            break;
                        }
                    }
                }
            }
        }
        return totalAttribute;
    });
    
    self.getBaseDamageReductionPct = ko.computed(function () {
        var totalAttribute = 1;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // vengefulspirit_command_aura
                            case 'bonus_damage_pct':
                                if (ability.name == 'vengefulspirit_command_aura') {
                                    totalAttribute *= (1 - self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100);
                                }
                            break;
                        }
                    }
                }
                else if (ability.baseDamageReductionPct != undefined) {
                    // nevermore_requiem
                    totalAttribute *= (1 + ability.baseDamageReductionPct()/100);
                }
            }
        }
        return totalAttribute;
    });
    
    self.getBAT = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // troll_warlord_berserkers_rage,alchemist_chemical_rage,lone_druid_true_form,lycan_shapeshift
                            case 'base_attack_time':
                                totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                            break;
                        }
                    }
                }
            }
        }
        return totalAttribute;
    });
    self.getBonusDamage = ko.computed(function () {
        var totalAttribute = 0;
        var sources = {};
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // broodmother_insatiable_hunger,luna_lunar_blessing,templar_assassin_refraction,templar_assassin_meld,troll_warlord_berserkers_rage,lone_druid_true_form_battle_cry
                            case 'bonus_damage':
                                if (ability.name == 'broodmother_insatiable_hunger' || ability.name == 'luna_lunar_blessing'
                                 || ability.name == 'templar_assassin_refraction' || ability.name == 'templar_assassin_meld'
                                 || ability.name == 'troll_warlord_berserkers_rage' || ability.name == 'lone_druid_true_form_battle_cry') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                    sources[ability.name] = {
                                        'damage': self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level()),
                                        'damageType': 'physical',
                                        'displayname': ability.displayname
                                    }
                                }
                            break;
                            // lycan_howl
                            case 'hero_bonus_damage':
                                totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                sources[ability.name] = {
                                    'damage': self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level()),
                                    'damageType': 'physical',
                                    'displayname': ability.displayname
                                }
                            break;
                        }
                    }
                    if (ability.name == 'storm_spirit_overload') {
                        totalAttribute += self.getAbilityPropertyValue(ability, 'damage');
                        sources[ability.name] = {
                            'damage': self.getAbilityPropertyValue(ability, 'damage'),
                            'damageType': 'magic',
                            'displayname': ability.displayname
                        }                        
                    }
                }
                else if (ability.bonusDamage != undefined && ability.bonusDamage() != 0) {
                    // nevermore_necromastery,ursa_fury_swipes,ursa_enrage,invoker_alacrity,invoker_exort,elder_titan_ancestral_spirit,spectre_desolate,razor_static_link
                    totalAttribute+=ability.bonusDamage();
                    sources[ability.name] = {
                        'damage': ability.bonusDamage(),
                        'damageType': ability.name == 'spectre_desolate' ? 'pure' : 'physical',
                        'displayname': ability.displayname
                    }
                }
            }
        }
        return { sources: sources, total: totalAttribute };
    });

    self.getBonusDamagePercent = ko.computed(function () {
        var totalAttribute = 0;
        var sources = {};
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // bloodseeker_bloodrage
                            case 'damage_increase_pct':
                                if (ability.name == 'bloodseeker_bloodrage') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                    sources[ability.name] = {
                                        'damage': self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100,
                                        'damageType': 'physical',
                                        'displayname': ability.displayname
                                    }
                                }
                            break;
                            // magnataur_empower,vengefulspirit_command_aura,alpha_wolf_command_aura
                            case 'bonus_damage_pct':
                                if (ability.name == 'magnataur_empower' || ability.name == 'vengefulspirit_command_aura' || ability.name == 'alpha_wolf_command_aura') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                    sources[ability.name] = {
                                        'damage': self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100,
                                        'damageType': 'physical',
                                        'displayname': ability.displayname
                                    }
                                }
                            break;
                            // sven_gods_strength
                            case 'gods_strength_damage':
                                if (ability.name == 'sven_gods_strength' && self.hero != undefined && self.hero.heroId() == 'sven') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                    sources[ability.name] = {
                                        'damage': self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100,
                                        'damageType': 'physical',
                                        'displayname': ability.displayname
                                    }
                                }
                            break;
                            case 'gods_strength_damage_scepter':
                                if (ability.name == 'sven_gods_strength' && self.hero == undefined) {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                    sources[ability.name] = {
                                        'damage': self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100,
                                        'damageType': 'physical',
                                        'displayname': ability.displayname
                                    }
                                }
                            break;
                        }
                    }
                }
                /*else if (ability.bonusDamagePct != undefined && ability.bonusDamagePct() != 0) {
                    // bloodseeker_bloodrage
                    // totalAttribute+=ability.bonusDamagePct()/100;
                    // sources[ability.name] = {
                        // 'damage': ability.bonusDamagePct()/100,
                        // 'damageType': 'physical',
                        // 'displayname': ability.displayname
                    // }
                }*/
            }
        }
        return { sources: sources, total: totalAttribute };
    });

    self.getBonusDamageBackstab = ko.computed(function () {
        var totalAttribute1 = 0;
        var totalAttribute2 = 0;
        var sources = [];
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.name == 'riki_backstab') {
                if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // riki_backstab
                            case 'damage_multiplier':
                                totalAttribute1 += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                sources.push({
                                    'damage': self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level()),
                                    'damageType': 'physical',
                                    'displayname': ability.displayname
                                });
                            break;
                        }
                    }/*
                    if (ability.bonusDamageBackstab != undefined) {
                        console.log('bonusDamageBackstab');
                        // damage_multiplier
                        totalAttribute2+=ability.bonusDamageBackstab();
                        sources.push({
                            'damage': ability.bonusDamageBackstab(),
                            'damageType': 'physical',
                            'displayname': ability.displayname
                        });
                    }
                    */
                }
            }
        }
        return { sources: sources, total: [totalAttribute1,totalAttribute2] };
    });
    
    self.getBonusDamagePrecisionAura = ko.computed(function () {
        var totalAttribute1 = 0;
        var totalAttribute2 = 0;
        var sources = [];
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.name == 'drow_ranger_trueshot') {
                if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // drow_ranger_trueshot
                            case 'trueshot_ranged_damage':
                                totalAttribute1 += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                sources.push({
                                    'damage': self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100,
                                    'damageType': 'physical',
                                    'displayname': ability.displayname
                                });
                            break;
                        }
                    }
                    if (ability.bonusDamagePrecisionAura != undefined) {
                        // drow_ranger_trueshot
                        totalAttribute2+=ability.bonusDamagePrecisionAura();
                        sources.push({
                            'damage': ability.bonusDamagePrecisionAura(),
                            'damageType': 'physical',
                            'displayname': ability.displayname
                        });
                    }
                }
            }
        }
        return { sources: sources, total: [totalAttribute1,totalAttribute2] };
    });
    
    self.getBonusDamageReduction = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // bane_enfeeble
                            case 'enfeeble_attack_reduction':
                                totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                            break;
                        }
                    }
                }
                else if (ability.bonusDamageReduction != undefined) {
                    // rubick_fade_bolt,razor_static_link
                    totalAttribute+=ability.bonusDamageReduction();
                }
            }
        }
        return totalAttribute;
    });
    
    self.getBonusDamageReductionPct = ko.computed(function () {
        var totalAttribute = 1;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // medusa_split_shot
                            case 'damage_modifier':
                                totalAttribute *= (1 + self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100);
                            break;
                            // windrunner_focusfire
                            case 'focusfire_damage_reduction':
                                if (!self.hasScepter()) {
                                    totalAttribute *= (1 + self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100);
                                }
                            break;
                            case 'focusfire_damage_reduction_scepter':
                                if (self.hasScepter()) {
                                    totalAttribute *= (1 + self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100);
                                }
                            break;
                        }
                    }
                }
            }
        }
        return totalAttribute;
    });

    self.getDamageAmplification = ko.computed(function () {
        var totalAttribute = 1;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                /*if (!(ability.name in self.abilityData)) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                            var attribute = self._abilities[i].attributes[j];
                            switch(attribute.name) {
                                // bane_enfeeble
                                case 'enfeeble_attack_reduction':
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                break;
                            }
                        }
                    }
                }
                else*/ if (ability.damageAmplification != undefined) {
                        // undying_flesh_golem
                        totalAttribute *= (1 + ability.damageAmplification()/100);
                }
            }
        }
        return totalAttribute;
    });
    
    self.getDamageReduction = ko.computed(function () {
        var totalAttribute = 1;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // bloodseeker_bloodrage
                            case 'damage_increase_pct':
                                if (ability.name == 'bloodseeker_bloodrage') {
                                    totalAttribute *= (1 + self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100);
                                }
                            break;
                        }
                    }
                    // kunkka_ghostship
                    if (ability.name == 'kunkka_ghostship') {
                        totalAttribute *= (1 - 50/100);
                    }
                }
                else if (ability.damageReduction != undefined) {
                    // wisp_overcharge,bristleback_bristleback,spectre_dispersion,medusa_mana_shield,ursa_enrage
                    totalAttribute *= (1 + ability.damageReduction()/100);
                }
            }
        }
        return totalAttribute;
    });

    self.getCritSource = ko.computed(function () {
        var sources = {};
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    switch(ability.name) {
                        // phantom_assassin_coup_de_grace,brewmaster_drunken_brawler,chaos_knight_chaos_strike,lycan_shapeshift,skeleton_king_mortal_strike,juggernaut_blade_dance,alpha_wolf_critical_strike,giant_wolf_critical_strike
                        case 'phantom_assassin_coup_de_grace':
                            if (sources[ability.name] == undefined) {
                                sources[ability.name] = {
                                    'chance': self.getAbilityAttributeValue(self._abilities[i].attributes, 'crit_chance', ability.level())/100,
                                    'multiplier': self.getAbilityAttributeValue(self._abilities[i].attributes, 'crit_bonus', ability.level())/100,
                                    'count': 1,
                                    'displayname': ability.displayname
                                }
                            }
                            else {
                                sources[ability.name].count += 1;
                            }
                        break;
                        case 'brewmaster_drunken_brawler':
                            if (sources[ability.name] == undefined) {
                                sources[ability.name] = {
                                    'chance': self.getAbilityAttributeValue(self._abilities[i].attributes, 'crit_chance', ability.level())/100,
                                    'multiplier': self.getAbilityAttributeValue(self._abilities[i].attributes, 'crit_multiplier', ability.level())/100,
                                    'count': 1,
                                    'displayname': ability.displayname
                                }
                            }
                            else {
                                sources[ability.name].count += 1;
                            }
                        break;
                        case 'chaos_knight_chaos_strike':
                        case 'lycan_shapeshift':
                            if (sources[ability.name] == undefined) {
                                sources[ability.name] = {
                                    'chance': self.getAbilityAttributeValue(self._abilities[i].attributes, 'crit_chance', ability.level())/100,
                                    'multiplier': self.getAbilityAttributeValue(self._abilities[i].attributes, 'crit_multiplier', ability.level())/100,
                                    'count': 1,
                                    'displayname': ability.displayname
                                }
                            }
                            else {
                                sources[ability.name].count += 1;
                            }
                        break;
                        case 'skeleton_king_mortal_strike':
                            if (sources[ability.name] == undefined) {
                                sources[ability.name] = {
                                    'chance': self.getAbilityAttributeValue(self._abilities[i].attributes, 'crit_chance', ability.level())/100,
                                    'multiplier': self.getAbilityAttributeValue(self._abilities[i].attributes, 'crit_mult', ability.level())/100,
                                    'count': 1,
                                    'displayname': ability.displayname
                                }
                            }
                            else {
                                sources[ability.name].count += 1;
                            }
                        break;
                        case 'juggernaut_blade_dance':
                            if (sources[ability.name] == undefined) {
                                sources[ability.name] = {
                                    'chance': self.getAbilityAttributeValue(self._abilities[i].attributes, 'blade_dance_crit_chance', ability.level())/100,
                                    'multiplier': self.getAbilityAttributeValue(self._abilities[i].attributes, 'blade_dance_crit_mult', ability.level())/100,
                                    'count': 1,
                                    'displayname': ability.displayname
                                }
                            }
                            else {
                                sources[ability.name].count += 1;
                            }
                        break;
                        case 'alpha_wolf_critical_strike':
                        case 'giant_wolf_critical_strike':
                            if (sources[ability.name] == undefined) {
                                sources[ability.name] = {
                                    'chance': self.getAbilityAttributeValue(self._abilities[i].attributes, 'crit_chance', ability.level())/100,
                                    'multiplier': self.getAbilityAttributeValue(self._abilities[i].attributes, 'crit_mult', ability.level())/100,
                                    'count': 1,
                                    'displayname': ability.displayname
                                }
                            }
                            else {
                                sources[ability.name].count += 1;
                            }
                        break;
                    }
                }
            }
        }
        return sources;
    });    

    self.getCleaveSource = ko.computed(function () {
        var sources = {};
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    switch(ability.name) {
                        // magnataur_empower
                        case 'magnataur_empower':
                            if (sources[ability.name] == undefined) {
                                sources[ability.name] = {
                                    'radius': self.getAbilityAttributeValue(self._abilities[i].attributes, 'cleave_radius', ability.level()),
                                    'magnitude': self.getAbilityAttributeValue(self._abilities[i].attributes, 'cleave_damage_pct', ability.level())/100,
                                    'count': 1,
                                    'displayname': ability.displayname
                                }
                            }
                            else {
                                sources[ability.name].count += 1;
                            }
                        break;
                        // sven_great_cleave
                        case 'sven_great_cleave':
                            if (sources[ability.name] == undefined) {
                                sources[ability.name] = {
                                    'radius': self.getAbilityAttributeValue(self._abilities[i].attributes, 'great_cleave_radius', ability.level()),
                                    'magnitude': self.getAbilityAttributeValue(self._abilities[i].attributes, 'great_cleave_damage', ability.level())/100,
                                    'count': 1,
                                    'displayname': ability.displayname
                                }
                            }
                            else {
                                sources[ability.name].count += 1;
                            }
                        break;
                        // kunkka_tidebringer
                        case 'kunkka_tidebringer':
                            if (sources[ability.name] == undefined) {
                                sources[ability.name] = {
                                    'radius': self.getAbilityAttributeValue(self._abilities[i].attributes, 'radius', ability.level()),
                                    'magnitude': 1,
                                    'count': 1,
                                    'displayname': ability.displayname
                                }
                            }
                            else {
                                sources[ability.name].count += 1;
                            }
                        break;
                        // tiny_grow
                        case 'tiny_grow':
                            if (self.hasScepter()) {
                                if (sources[ability.name] == undefined) {
                                    sources[ability.name] = {
                                        'radius': self.getAbilityAttributeValue(self._abilities[i].attributes, 'bonus_cleave_radius_scepter', ability.level()),
                                        'magnitude': self.getAbilityAttributeValue(self._abilities[i].attributes, 'bonus_cleave_damage_scepter', ability.level())/100,
                                        'count': 1,
                                        'displayname': ability.displayname
                                    }
                                }
                                else {
                                    sources[ability.name].count += 1;
                                }
                            }
                        break;
                    }
                }
            }
        }
        return sources;
    });    
    
    self.getCritChance = ko.computed(function () {
        var totalAttribute = 1;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // phantom_assassin_coup_de_grace,brewmaster_drunken_brawler,chaos_knight_chaos_strike,lycan_shapeshift,skeleton_king_mortal_strike
                            case 'crit_chance':
                                totalAttribute *= (1 - self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100);
                            break;
                        }
                    }
                }
            }
        }
        return totalAttribute;
    });            
    
    self.getEvasion = ko.computed(function () {
        var totalAttribute = 1;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // phantom_assassin_blur
                            case 'bonus_evasion':
                            // brewmaster_drunken_brawler
                            case 'dodge_chance':
                                totalAttribute *= (1 - self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100);
                            break;
                        }
                    }
                }
            }
        }
        return totalAttribute;
    });
    
    self.getEvasionBacktrack = ko.computed(function () {
        var totalAttribute = 1;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // faceless_void_backtrack
                            case 'dodge_chance_pct':
                                totalAttribute *= (1 - self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100);
                            break;
                        }
                    }
                }
            }
        }
        return totalAttribute;
    });
    
    self.getMissChance = ko.computed(function () {
        var totalAttribute = 1;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // broodmother_incapacitating_bite,brewmaster_drunken_haze
                            case 'miss_chance':
                            // riki_smoke_screen,keeper_of_the_light_blinding_light,tinker_laser
                            case 'miss_rate':
                                totalAttribute *= (1 - self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100);
                            break;
                        }
                    }
                }
                else if (ability.missChance != undefined) {
                    // night_stalker_crippling_fear
                    totalAttribute*=(1-ability.missChance()/100);
                }
            }
        }
        return totalAttribute;
    });
    
    self.getLifesteal = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // skeleton_king_vampiric_aura
                            case 'vampiric_aura':
                            // broodmother_insatiable_hunger
                            case 'lifesteal_pct':
                                totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                            break;
                        }
                    }
                }
                else if (ability.lifesteal != undefined) {
                    // life_stealer_open_wounds
                    totalAttribute+=ability.lifesteal();
                }
            }
        }
        return totalAttribute;
    });
    
    self.getMagicResist = ko.computed(function () {
        var totalAttribute = 1;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // antimage_spell_shield
                            case 'spell_shield_resistance':
                                totalAttribute *= (1 - self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100);
                            break;
                            // phantom_lancer_phantom_edge
                            case 'magic_resistance_pct':
                                if (ability.name == 'phantom_lancer_phantom_edge') {
                                    totalAttribute *= (1 - self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100);
                                }
                            break;
                            // rubick_null_field
                            case 'magic_damage_reduction_pct':
                                if (ability.name == 'rubick_null_field') {
                                    totalAttribute *= (1 - self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100);
                                }
                            break;
                        }
                    }
                }
                else if (ability.magicResist != undefined) {
                    // huskar_berserkers_blood,viper_corrosive_skin,visage_gravekeepers_cloak
                    totalAttribute *= (1 - ability.magicResist()/100);
                }
            }
        }
        return totalAttribute;
    });

    self.getMagicResistReduction = ko.computed(function () {
        var totalAttribute = 1;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // ancient_apparition_ice_vortex
                            case 'spell_resist_pct':
                            // pugna_decrepify
                            case 'bonus_spell_damage_pct':
                            // skywrath_mage_ancient_seal
                            case 'resist_debuff':
                                totalAttribute *= (1 - self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100);
                            break;
                            // elder_titan_natural_order
                            case 'magic_resistance_pct':
                                totalAttribute *= (1 - self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100);
                            break;
                        }
                    }
                }
            }
        }
        return totalAttribute;
    });
    
    self.getMovementSpeedFlat = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // alchemist_chemical_rage
                            case 'bonus_movespeed':
                                if (ability.name == 'alchemist_chemical_rage') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                }
                            break;
                            // tiny_grow
                            case 'bonus_movement_speed':
                                if (ability.name == 'tiny_grow') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                }
                            break;
                            // troll_warlord_berserkers_rage
                            case 'bonus_move_speed':
                                if (ability.name == 'troll_warlord_berserkers_rage') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                                }                                
                            break;
                            // lone_druid_true_form
                            case 'speed_loss':
                                totalAttribute -= self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                            break;
                        }
                    }
                }
                else if (ability.movementSpeedFlat != undefined) {
                // dragon_knight_elder_dragon_form
                    totalAttribute+=ability.movementSpeedFlat();
                }
            }
        }
        return totalAttribute;
    });
    
    self.getMovementSpeedPercent = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // abaddon_frostmourne 
                            case 'move_speed_pct':
                            // bounty_hunter_track 
                            case 'bonus_move_speed_pct':
                            // mirana_leap 
                            case 'leap_speedbonus':
                            // sven_warcry 
                            case 'warcry_movespeed':
                            // clinkz_wind_walk
                            case 'move_speed_bonus_pct':
                            // windrunner_windrun
                            case 'movespeed_bonus_pct':
                                totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                            break;
                            // broodmother_spin_web,spectre_spectral_dagger
                            case 'bonus_movespeed':
                                if (ability.name == 'broodmother_spin_web' || ability.name == 'spectre_spectral_dagger') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                            break;
                            // axe_culling_blade,necronomicon_archer_aoe
                            case 'speed_bonus':
                                if (ability.name == 'axe_culling_blade' || ability.name == 'necronomicon_archer_aoe') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                            break;
                            // nyx_assassin_vendetta 
                            case 'movement_speed':
                                if (ability.name == 'nyx_assassin_vendetta') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                            break;
                            // spirit_breaker_empowering_haste
                            case 'bonus_movespeed_pct':
                                if (ability.name == 'spirit_breaker_empowering_haste') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                            break;
                            // ogre_magi_bloodlust,death_prophet_witchcraft,kobold_taskmaster_speed_aura
                            case 'bonus_movement_speed':
                                if (ability.name == 'ogre_magi_bloodlust' || ability.name == 'death_prophet_witchcraft' || ability.name == 'kobold_taskmaster_speed_aura') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                            break;
                            // razor_unstable_current,phantom_lancer_doppelwalk
                            case 'movement_speed_pct':
                                if (ability.name == 'razor_unstable_current' || ability.name == 'phantom_lancer_doppelwalk') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                            break;
                            // treant_natures_guise,lone_druid_rabid
                            case 'bonus_move_speed':
                                if (ability.name == 'treant_natures_guise' || ability.name == 'lone_druid_rabid') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                            break;
                            // wisp_tether
                            case 'movespeed':
                                if (ability.name == 'wisp_tether') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                            break;
                            // kunkka_ghostship,visage_grave_chill
                            case 'movespeed_bonus':
                                if (ability.name == 'kunkka_ghostship' || ability.name == 'visage_grave_chill') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }                                
                            break;
                        }
                    }
                }
                else if (ability.movementSpeedPct != undefined) {
                // axe_battle_hunger,bristleback_warpath,spirit_breaker_greater_bash,lina_fiery_soul,invoker_ghost_walk,invoker_wex,elder_titan_ancestral_spirit
                    totalAttribute+=ability.movementSpeedPct()/100;
                }
            }
        }
        return totalAttribute;
    });

    self.getMovementSpeedPercentReduction = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // crystal_maiden_freezing_field
                            case 'movespeed_slow':
                                if (ability.name == 'crystal_maiden_freezing_field' && !self.hasScepter()) {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                            break;
                            case 'movespeed_slow_scepter':
                                if (ability.name == 'crystal_maiden_freezing_field' && self.hasScepter()) {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                            break;
                            // elder_titan_earth_splitter,magnataur_skewer,abaddon_frostmourne 
                            case 'slow_pct':
                                totalAttribute -= self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                            break;
                            // night_stalker_void,crystal_maiden_crystal_nova,ghost_frost_attack,ogre_magi_frost_armor,polar_furbolg_ursa_warrior_thunder_clap
                            case 'movespeed_slow':
                                if (ability.name != 'crystal_maiden_freezing_field') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                            break;
                            // lich_frost_armor,lich_frost_nova,enchantress_enchant
                            case 'slow_movement_speed':
                            // beastmaster_primal_roar
                            case 'slow_movement_speed_pct':
                            // drow_ranger_frost_arrows
                            case 'frost_arrows_movement_speed':
                            // skeleton_king_hellfire_blast
                            case 'blast_slow':
                            // slardar_slithereen_crush
                            case 'crush_extra_slow':
                            // storm_spirit_overload:
                            case 'overload_move_slow':
                            // windrunner_windrun
                            case 'enemy_movespeed_bonus_pct':
                                totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                            break;
                            // phantom_assassin_stifling_dagger,tusk_frozen_sigil
                            case 'move_slow':
                                if (ability.name == 'phantom_assassin_stifling_dagger') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                                else if (ability.name == 'tusk_frozen_sigil') {
                                    totalAttribute -= self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                            break;
                            // invoker_ice_wall,medusa_stone_gaze,wisp_tether
                            case 'slow':
                                if (ability.name == 'medusa_stone_gaze') {
                                    totalAttribute -= self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                                else {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                            break;
                            // broodmother_incapacitating_bite,bounty_hunter_jinada,spectre_spectral_dagger,winter_wyvern_arctic_burn
                            case 'bonus_movespeed':
                                if (ability.name == 'broodmother_incapacitating_bite' || ability.name == 'bounty_hunter_jinada' || ability.name == 'winter_wyvern_arctic_burn' || ability.name == 'winter_wyvern_splinter_blast') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                                else if (ability.name == 'spectre_spectral_dagger') {
                                    totalAttribute -= self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                            break;
                            // omniknight_degen_aura
                            case 'speed_bonus':
                                if (ability.name == 'omniknight_degen_aura') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                            break;
                            // tidehunter_gush
                            case 'movement_speed':
                                if (ability.name == 'tidehunter_gush') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                            break;
                            // pugna_decrepify,chen_penitence
                            case 'bonus_movement_speed':
                                if (ability.name == 'pugna_decrepify' || ability.name == 'chen_penitence') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                            break;
                            // ancient_apparition_ice_vortex,phantom_lancer_spirit_lance,skywrath_mage_concussive_shot,faceless_void_time_walk
                            case 'movement_speed_pct':
                                if (ability.name == 'ancient_apparition_ice_vortex' || ability.name == 'phantom_lancer_spirit_lance' || ability.name == 'faceless_void_time_walk') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                                else if (ability.name == 'skywrath_mage_concussive_shot') {
                                    totalAttribute -= self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                            break;
                            // razor_unstable_current
                            case 'slow_amount':
                                if (ability.name == 'razor_unstable_current') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                            break;
                            // brewmaster_drunken_haze,brewmaster_thunder_clap,treant_leech_seed
                            case 'movement_slow':
                                if (ability.name == 'brewmaster_drunken_haze' || ability.name == 'brewmaster_thunder_clap') {
                                    totalAttribute -= self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                                else if (ability.name == 'ursa_earthshock' || ability.name == 'treant_leech_seed') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                            break;
                            // skeleton_king_reincarnation
                            case 'movespeed':
                                if (ability.name == 'skeleton_king_reincarnation') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                            break;
                            // kunkka_torrent,visage_grave_chill
                            case 'movespeed_bonus':
                                if (ability.name == 'kunkka_torrent') {
                                    totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                                else if (ability.name == 'visage_grave_chill') {
                                    totalAttribute -= self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                            break;
                        }
                    }
                    if (ability.name == 'satyr_trickster_purge') {
                        totalAttribute -= 80/100;
                    }
                    else if (ability.name == 'enraged_wildkin_tornado') {
                        totalAttribute -= 15/100;
                    }
                }
                else if (ability.movementSpeedPctReduction != undefined) {
                    // axe_battle_hunger,batrider_sticky_napalm,shredder_chakram,meepo_geostrike,life_stealer_open_wounds,
                    // venomancer_poison_sting,viper_viper_strike,viper_corrosive_skin,viper_poison_attack,venomancer_venomous_gale,treant_leech_seed
                    // lich_chain_frost,sniper_shrapnel,centaur_stampede,huskar_life_break,jakiro_dual_breath,meepo_geostrike,sandking_epicenter
                    // earth_spirit_rolling_boulder,invoker_ghost_walk,invoker_ice_wall,elder_titan_earth_splitter
                    // undying_flesh_golem,templar_assassin_psionic_trap,nevermore_requiem,queenofpain_shadow_strike
                    totalAttribute+=ability.movementSpeedPctReduction()/100;
                }
            }
        }
        return totalAttribute;
    });

    self.getTurnRateReduction = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // medusa_stone_gaze
                            case 'slow':
                                if (ability.name == 'medusa_stone_gaze') {
                                    totalAttribute -= self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                                }
                            break;
                        }
                    }
                }
                else if (ability.turnRateReduction != undefined) {
                    // batrider_sticky_napalm
                    totalAttribute+=ability.turnRateReduction()/100;
                }
            }
        }
        return totalAttribute;
    });
    
    self.getVisionRangeNight = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // winter_wyvern_arctic_burn
                            case 'night_vision_bonus':
                            // lycan_shapeshift,luna_lunar_blessing
                            case 'bonus_night_vision':
                                totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level());
                            break;
                        }
                    }
                }
                else if (ability.visionnight != undefined) {
                    // 
                    totalAttribute+=ability.visionnight();
                }
            }
        }
        return totalAttribute;
    });

    self.getVisionRangePctReduction = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // night_stalker_darkness
                            case 'blind_percentage':
                                totalAttribute += self.getAbilityAttributeValue(self._abilities[i].attributes, attribute.name, ability.level())/100;
                            break;
                        }
                    }
                }
            }
        }
        return totalAttribute;
    });

    self.setEvasion = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (ability.name == 'windrunner_windrun') {
                    return 1;
                }
            }
        }
        return totalAttribute;
    });
    
    self.setMovementSpeed = ko.computed(function () {
        var MAX_MOVESPEED = 522;
        var MIN_MOVESPEED = 100;
        var totalAttribute = 0;
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (ability.name == 'spirit_breaker_charge_of_darkness') {
                    return self.getAbilityAttributeValue(ability.attributes, 'movement_speed', ability.level());
                }
                if (ability.name == 'dark_seer_surge') {
                    return MAX_MOVESPEED;
                }
                if (ability.name == 'centaur_stampede') {
                    return MAX_MOVESPEED;
                }
                if (ability.name == 'lycan_shapeshift') {
                    return MAX_MOVESPEED;
                }
                if (ability.name == 'lion_voodoo' || ability.name == 'shadow_shaman_voodoo') {
                    return MIN_MOVESPEED;
                }
            }
        }
        return totalAttribute;
    });

    self.getBashSource = function (attacktype) {
        var sources = {};
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // sniper_headshot
                            case 'proc_chance':
                                if (sources[ability.name] == undefined && ability.name == 'sniper_headshot') {
                                    sources[ability.name] = {
                                        'chance': self.getAbilityAttributeValue(ability.attributes, attribute.name, ability.level())/100,
                                        'damage': self.getAbilityPropertyValue(ability, 'damage'),
                                        'count': 1,
                                        'damageType': 'physical',
                                        'displayname': ability.displayname
                                    }
                                }
                            break;
                            // slardar_bash
                            case 'chance':
                                if (sources[ability.name] == undefined && ability.name == 'slardar_bash') {
                                    sources[ability.name] = {
                                        'chance': self.getAbilityAttributeValue(ability.attributes, attribute.name, ability.level())/100,
                                        'damage': self.getAbilityAttributeValue(ability.attributes, 'bonus_damage', ability.level()),
                                        'count': 1,
                                        'damageType': 'physical',
                                        'displayname': ability.displayname
                                    }
                                }
                            break;
                        }
                    }
                }
                else if (ability.bashBonusDamage != undefined) {
                    // faceless_void_time_lock
                    if (sources[ability.name] == undefined && ability.name == 'faceless_void_time_lock') {
                        sources[ability.name] = {
                            'chance': ability.bash()/100,
                            'damage': ability.bashBonusDamage(),
                            'count': 1,
                            'damageType': 'magic',
                            'displayname': ability.displayname
                        }
                    }
                    // spirit_breaker_greater_bash
                    if (sources[ability.name] == undefined && ability.name == 'spirit_breaker_greater_bash') {
                        sources[ability.name] = {
                            'chance': ability.bash()/100,
                            'damage': ability.bashBonusDamage()/100,
                            'count': 1,
                            'damageType': 'magic',
                            'displayname': ability.displayname
                        }
                    }
                }
            }
        }

        return sources;
    };
    
    self.getOrbSource = function () {
        var sources = {};
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self._abilities[i];
            if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                if (!(ability.name in self.abilityData)) {
                    for (var j = 0; j < self._abilities[i].attributes.length; j++) {
                        var attribute = self._abilities[i].attributes[j];
                        switch(attribute.name) {
                            // antimage_mana_break
                            case 'mana_per_hit':
                                if (sources[ability.name] == undefined && ability.name == 'antimage_mana_break') {
                                    sources[ability.name] = {
                                        'damage': self.getAbilityAttributeValue(ability.attributes, attribute.name, ability.level()) 
                                                * self.getAbilityAttributeValue(ability.attributes, 'damage_per_burn', ability.level()),
                                        'damageType': 'physical',
                                        'displayname': ability.displayname
                                    }
                                }
                            break;
                            // clinkz_searing_arrows
                            case 'damage_bonus':
                                if (sources[ability.name] == undefined && ability.name == 'clinkz_searing_arrows') {
                                    sources[ability.name] = {
                                        'damage': self.getAbilityAttributeValue(ability.attributes, attribute.name, ability.level()),
                                        'damageType': 'physical',
                                        'displayname': ability.displayname
                                    }
                                }
                            // silencer_glaives_of_wisdom
                            case 'intellect_damage_pct':
                                if (sources[ability.name] == undefined && ability.name == 'silencer_glaives_of_wisdom') {
                                    sources[ability.name] = {
                                        'damage': self.getAbilityAttributeValue(ability.attributes, attribute.name, ability.level())/100 * self.hero.totalInt(),
                                        'damageType': 'pure',
                                        'displayname': ability.displayname
                                    }
                                }
                            break;
                        }
                    }
                }
                else if (ability.bonusDamageOrb != undefined) {
                    // obsidian_destroyer_arcane_orb
                    if (sources[ability.name] == undefined && ability.name == 'obsidian_destroyer_arcane_orb') {
                        sources[ability.name] = {
                            'damage': ability.bonusDamageOrb(),
                            'damageType': 'pure',
                            'displayname': ability.displayname
                        }
                    }
                }
            }
        }
        
        return sources;
    };
    
    self.toggleAbility = function (index, data, event) {
        if (self.abilities()[index()].behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') < 0) {
            if (self.abilities()[index()].isActive()) {
                self.abilities()[index()].isActive(false);
            }
            else {
                self.abilities()[index()].isActive(true);
            }
            
            if (self.abilities()[index()].name == 'lycan_shapeshift') {
                self.isShapeShiftActive(self.abilities()[index()].isActive());
            }
        }
    }.bind(this);

    self.toggleAbilityDetail = function (index, data, event) {
        if (self.abilities()[index()].isDetail()) {
            self.abilities()[index()].isDetail(false);
        }
        else {
            self.abilities()[index()].isDetail(true);
        }
    }.bind(this);
    
    self.getAbility = function (abilityName) {
        return self.abilities().find(function(b) {
            return b.name == abilityName;
        });
    }
}

AbilityModel.prototype.levelUpAbility = function (index, data, event, hero) {
    var self = this;
    if (self.abilities()[index()].level() < hero.getAbilityLevelMax(data) && hero.availableSkillPoints() > 0 ) {
        switch(self.abilities()[index()].abilitytype) {
            case 'DOTA_ABILITY_TYPE_ULTIMATE':
                if (hero.heroId() == 'invoker') {
                    if (
                        (self.abilities()[index()].level() == 0) && (parseInt(hero.selectedHeroLevel()) >= 2) ||
                        (self.abilities()[index()].level() == 1) && (parseInt(hero.selectedHeroLevel()) >= 7) ||
                        (self.abilities()[index()].level() == 2) && (parseInt(hero.selectedHeroLevel()) >= 11) ||
                        (self.abilities()[index()].level() == 3) && (parseInt(hero.selectedHeroLevel()) >= 17)
                    ) {
                        self.abilities()[index()].level(self.abilities()[index()].level()+1);
                        hero.skillPointHistory.push(index());
                    }
                }
                else if (hero.heroId() == 'meepo') {
                    if (self.abilities()[index()].level() * 7 + 3 <= parseInt(hero.selectedHeroLevel())) {
                        self.abilities()[index()].level(self.abilities()[index()].level()+1);
                        hero.skillPointHistory.push(index());
                    }
                }
                else {
                    if ((self.abilities()[index()].level()+1) * 5 + 1 <= parseInt(hero.selectedHeroLevel())) {
                        self.abilities()[index()].level(self.abilities()[index()].level()+1);
                        hero.skillPointHistory.push(index());
                    }
                }
            break;
            default:
                if (self.abilities()[index()].level() * 2 + 1 <= parseInt(hero.selectedHeroLevel())) {
                    self.abilities()[index()].level(self.abilities()[index()].level()+1);
                    hero.skillPointHistory.push(index());
                }
            break;
        }
        switch (self.abilities()[index()].name) {
            case 'beastmaster_call_of_the_wild':
            case 'chen_test_of_faith':
            case 'morphling_morph_agi':
            case 'shadow_demon_shadow_poison':
                self.abilities()[index() + 1].level(self.abilities()[index()].level());
            break;
            case 'morphling_morph_str':
                self.abilities()[index() - 1].level(self.abilities()[index()].level());
            break;
            case 'keeper_of_the_light_spirit_form':
                self.abilities()[index() - 1].level(self.abilities()[index()].level());
                self.abilities()[index() - 2].level(self.abilities()[index()].level());
            break;
            case 'nevermore_shadowraze1':
                self.abilities()[index() + 1].level(self.abilities()[index()].level());
                self.abilities()[index() + 2].level(self.abilities()[index()].level());
            break;
            case 'nevermore_shadowraze2':
                self.abilities()[index() - 1].level(self.abilities()[index()].level());
                self.abilities()[index() + 1].level(self.abilities()[index()].level());
            break;
            case 'nevermore_shadowraze3':
                self.abilities()[index() - 1].level(self.abilities()[index()].level());
                self.abilities()[index() - 2].level(self.abilities()[index()].level());
            break;
            case 'ember_spirit_fire_remnant':
                self.abilities()[index() - 1].level(self.abilities()[index()].level());
            break;
            case 'lone_druid_true_form':
                self.abilities()[index() - 1].level(self.abilities()[index()].level());
            break;
        }
    }
};
AbilityModel.prototype.levelDownAbility = function (index, data, event, hero) {
    var i = ko.utils.unwrapObservable(index);
    var self = this;
    if (self.abilities()[i].level() > 0) {
        self.abilities()[i].level(self.abilities()[i].level() - 1);
        hero.skillPointHistory.splice(hero.skillPointHistory().lastIndexOf(i), 1);
        switch (self.abilities()[i].name) {
            case 'beastmaster_call_of_the_wild':
            case 'chen_test_of_faith':
            case 'morphling_morph_agi':
            case 'shadow_demon_shadow_poison':
                self.abilities()[i + 1].level(self.abilities()[i].level());
            break;
            case 'morphling_morph_str':
                self.abilities()[i - 1].level(self.abilities()[i].level());
            break;
            case 'keeper_of_the_light_spirit_form':
                self.abilities()[i - 1].level(self.abilities()[i].level());
                self.abilities()[i - 2].level(self.abilities()[i].level());
            break;
            case 'nevermore_shadowraze1':
                self.abilities()[i + 1].level(self.abilities()[i].level());
                self.abilities()[i + 2].level(self.abilities()[i].level());
            break;
            case 'nevermore_shadowraze2':
                self.abilities()[i - 1].level(self.abilities()[i].level());
                self.abilities()[i + 1].level(self.abilities()[i].level());
            break;
            case 'nevermore_shadowraze3':
                self.abilities()[i - 1].level(self.abilities()[i].level());
                self.abilities()[i - 2].level(self.abilities()[i].level());
            break;
            case 'ember_spirit_fire_remnant':
                self.abilities()[i - 1].level(self.abilities()[i].level());
            break;
            case 'lone_druid_true_form':
                self.abilities()[i - 1].level(self.abilities()[i].level());
            break;
        }
    }
};
AbilityModel.prototype.getAbilityAttributeValue = function (attributes, attributeName, level) {
    for (var i=0; i < attributes.length; i++) {
        if (attributes[i].name == attributeName) {
            if (level == 0) {
                return parseFloat(attributes[i].value[0]);
            }
            else if (level > attributes[i].value.length) {
                return parseFloat(attributes[i].value[0]);
            }
            else {
                return parseFloat(attributes[i].value[level-1]);
            }
        }
    }
}
AbilityModel.prototype.getAbilityAttributeTooltip = function (attributes, attributeName) {
    for (var i=0; i<attributes.length; i++) {
        if (attributes[i].name == attributeName) {
            if (attributes[i].hasOwnProperty('tooltip')) {
                var d = attributes[i].tooltip.replace(/\\n/g, '');
                return d;
            }
            else {
                return '';
            }
        }
    }
    return '';
}

module.exports = AbilityModel;
},{"./herocalc_abilitydata":18,"./herocalc_knockout":19}],2:[function(require,module,exports){
'use strict';
var ko = require('./herocalc_knockout');

var AbilityModel = require("./AbilityModel");
var InventoryViewModel = require("./inventory/InventoryViewModel");
var findWhere = require("./util/findWhere");
var buffOptionsArray = require("./buffs/buffOptionsArray");
var debuffOptionsArray = require("./buffs/debuffOptionsArray");

var BuffViewModel = function (itemData, a) {
    var self = this;
    AbilityModel.call(this, ko.observableArray([]));
    self.availableBuffs = ko.observableArray(buffOptionsArray.items);
    self.availableDebuffs = ko.observableArray(debuffOptionsArray.items);
    self.selectedBuff = ko.observable(self.availableBuffs()[0]);
    
    self.buffs = ko.observableArray([]);
    self.itemBuffs = new InventoryViewModel(itemData);
    
    self.addBuff = function (data, event) {
        if (findWhere(self.buffs(), { name: self.selectedBuff().buffName }) == undefined) {
            var a = JSON.parse(JSON.stringify(self.selectedBuff().abilityData));
            a.level = ko.observable(0);
            a.isActive = ko.observable(false);
            a.isDetail = ko.observable(false);
            a.baseDamage = ko.observable(0);
            a.bash = ko.observable(0);
            a.bashBonusDamage = ko.observable(0);
            a.bonusDamage = ko.observable(0);
            a.bonusDamageOrb = ko.observable(0);
            a.bonusDamagePct = ko.observable(0);
            a.bonusDamagePrecisionAura = ko.observable(0);
            a.bonusDamageReduction = ko.observable(0);
            a.bonusHealth = ko.observable(0);
            a.bonusStrength = ko.observable(0);
            a.bonusStrength2 = ko.observable(0);
            a.bonusAgility = ko.observable(0);
            a.bonusAgility2 = ko.observable(0);
            a.bonusInt = ko.observable(0);
            a.bonusAllStatsReduction = ko.observable(0);
            a.damageAmplification = ko.observable(0);
            a.damageReduction = ko.observable(0);
            a.evasion = ko.observable(0);
            a.magicResist = ko.observable(0);
            a.manaregen = ko.observable(0);
            a.manaregenreduction = ko.observable(0);
            a.missChance = ko.observable(0);
            a.movementSpeedFlat = ko.observable(0);
            a.movementSpeedPct = ko.observable(0);
            a.movementSpeedPctReduction = ko.observable(0);
            a.turnRateReduction = ko.observable(0);
            a.attackrange = ko.observable(0);
            a.attackspeed = ko.observable(0);
            a.attackspeedreduction = ko.observable(0);
            a.armor = ko.observable(0);
            a.armorReduction = ko.observable(0);
            a.healthregen = ko.observable(0);
            a.lifesteal = ko.observable(0);
            a.visionnight = ko.observable(0);
            a.visionday = ko.observable(0);
            switch (a.name) {
                case 'invoker_cold_snap':
                case 'invoker_ghost_walk':
                case 'invoker_tornado':
                case 'invoker_emp':
                case 'invoker_alacrity':
                case 'invoker_chaos_meteor':
                case 'invoker_sun_strike':
                case 'invoker_forge_spirit':
                case 'invoker_ice_wall':
                case 'invoker_deafening_blast':
                    a.level(1);
                break;
            }
            self.abilities.push(a);
            self.buffs.push({ name: self.selectedBuff().buffName, hero: self.selectedBuff().hero, data: a });
        }
    };
    
    self.removeBuff = function (data, event, abilityName) {
        if (findWhere(self.buffs(), { name: abilityName })  != undefined) {
                self.buffs.remove(findWhere(self.buffs(), { name: abilityName }));
                if (self.abilityControlData[abilityName] != undefined) {
                    for (var i = 0; i < self.abilityControlData[abilityName].data.length; i++) {
                        if (self.abilityControlData[abilityName].data[i].controlVal.dispose != undefined) {
                            self.abilityControlData[abilityName].data[i].controlVal.dispose();
                        }
                        if (self.abilityControlData[abilityName].data[i].clean != undefined) {
                            self.abilityControlData[abilityName].data[i].clean.dispose();
                        }
                    }
                    self.abilityControlData[abilityName] = undefined;
                }
                for (var i = 0; i < self.abilities().length; i++) {
                    if (self.abilities()[i].name == abilityName) {
                        self.abilities()[i].level(0);
                        self.abilities.remove(self.abilities()[i]);
                        break;
                    }
                }
        }
    };
    self.toggleBuff = function (index, data, event) {
        if (self.buffs()[index()].data.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') < 0) {
            if (self.buffs()[index()].data.isActive()) {
                self.buffs()[index()].data.isActive(false);
                self.abilities()[index()].isActive(false);
            }
            else {
                self.buffs()[index()].data.isActive(true);
                self.abilities()[index()].isActive(true);
            }
        }
    }.bind(this);

    self.toggleBuffDetail = function (index, data, event) {
        if (self.buffs()[index()].data.isDetail()) {
            self.buffs()[index()].data.isDetail(false);
        }
        else {
            self.buffs()[index()].data.isDetail(true);
        }
    }.bind(this);

    // Overrides the ability module function to remove available skill point check
    self.levelUpAbility = function (index, data, event, hero) {
        if (self.abilities()[index()].level() < hero.getAbilityLevelMax(data)) {
            switch(self.abilities()[index()].abilitytype) {
                case 'DOTA_ABILITY_TYPE_ULTIMATE':
                    self.abilities()[index()].level(self.abilities()[index()].level() + 1);
                break;
                default:
                    self.abilities()[index()].level(self.abilities()[index()].level() + 1);
                break;
            }
            switch (self.abilities()[index()].name) {
                case 'beastmaster_call_of_the_wild':
                case 'chen_test_of_faith':
                case 'morphling_morph_agi':
                case 'shadow_demon_shadow_poison':
                    self.abilities()[index() + 1].level(self.abilities()[index()].level());
                break;
                case 'morphling_morph_str':
                    self.abilities()[index() - 1].level(self.abilities()[index()].level());
                break;
                case 'keeper_of_the_light_spirit_form':
                    self.abilities()[index() - 1].level(self.abilities()[index()].level());
                    self.abilities()[index() - 2].level(self.abilities()[index()].level());
                case 'nevermore_shadowraze1':
                    self.abilities()[index() + 1].level(self.abilities()[index()].level());
                    self.abilities()[index() + 2].level(self.abilities()[index()].level());
                break;
                case 'nevermore_shadowraze2':
                    self.abilities()[index() - 1].level(self.abilities()[index()].level());
                    self.abilities()[index() + 1].level(self.abilities()[index()].level());
                break;
                case 'nevermore_shadowraze3':
                    self.abilities()[index() - 1].level(self.abilities()[index()].level());
                    self.abilities()[index() - 2].level(self.abilities()[index()].level());
                break;
            }
        }
    };
    self.levelDownAbility = function (index, data, event, hero) {
        if (self.abilities()[index()].level() > 0) {
            self.abilities()[index()].level(self.abilities()[index()].level() - 1);
            switch (self.abilities()[index()].name) {
                case 'beastmaster_call_of_the_wild':
                case 'chen_test_of_faith':
                case 'morphling_morph_agi':
                case 'shadow_demon_shadow_poison':
                    self.abilities()[index() + 1].level(self.abilities()[index()].level());
                break;
                case 'morphling_morph_str':
                    self.abilities()[index() - 1].level(self.abilities()[index()].level());
                break;
                case 'keeper_of_the_light_spirit_form':
                    self.abilities()[index() - 1].level(self.abilities()[index()].level());
                    self.abilities()[index() - 2].level(self.abilities()[index()].level());
                case 'nevermore_shadowraze1':
                    self.abilities()[index() + 1].level(self.abilities()[index()].level());
                    self.abilities()[index() + 2].level(self.abilities()[index()].level());
                break;
                case 'nevermore_shadowraze2':
                    self.abilities()[index() - 1].level(self.abilities()[index()].level());
                    self.abilities()[index() + 1].level(self.abilities()[index()].level());
                break;
                case 'nevermore_shadowraze3':
                    self.abilities()[index() - 1].level(self.abilities()[index()].level());
                    self.abilities()[index() - 2].level(self.abilities()[index()].level());
                break;
                case 'ember_spirit_fire_remnant':
                    self.abilities()[index() - 1].level(self.abilities()[index()].level());
                break;
                case 'lone_druid_true_form':
                    self.abilities()[index() - 1].level(self.abilities()[index()].level());
                break;
            }
        }
    };
    
    return self;
}
BuffViewModel.prototype = Object.create(AbilityModel.prototype);
BuffViewModel.prototype.constructor = BuffViewModel;

module.exports = BuffViewModel;
},{"./AbilityModel":1,"./buffs/buffOptionsArray":4,"./buffs/debuffOptionsArray":5,"./herocalc_knockout":19,"./inventory/InventoryViewModel":22,"./util/findWhere":33}],3:[function(require,module,exports){
var findWhere = require("../util/findWhere");

var BuffModel = function (heroData, unitData, hero, ability) {
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

module.exports = BuffModel;
},{"../util/findWhere":33}],4:[function(require,module,exports){
var BuffModel = require("./BuffModel");

var buffOptionsArray = {};

var init = function (heroData) {
    buffOptionsArray.items = [
        new BuffModel(heroData, 'abaddon', 'abaddon_frostmourne'),
        new BuffModel(heroData, 'axe', 'axe_culling_blade'),
        new BuffModel(heroData, 'beastmaster', 'beastmaster_inner_beast'),
        new BuffModel(heroData, 'bloodseeker', 'bloodseeker_bloodrage'),
        new BuffModel(heroData, 'bounty_hunter', 'bounty_hunter_track'),
        new BuffModel(heroData, 'centaur', 'centaur_stampede'),
        new BuffModel(heroData, 'crystal_maiden', 'crystal_maiden_brilliance_aura'),
        new BuffModel(heroData, 'dark_seer', 'dark_seer_surge'),
        new BuffModel(heroData, 'dazzle', 'dazzle_weave'),
        new BuffModel(heroData, 'drow_ranger', 'drow_ranger_trueshot'),
        new BuffModel(heroData, 'invoker', 'invoker_alacrity'),
        new BuffModel(heroData, 'wisp', 'wisp_tether'),
        new BuffModel(heroData, 'wisp', 'wisp_overcharge'),
        new BuffModel(heroData, 'kunkka', 'kunkka_ghostship'),
        new BuffModel(heroData, 'lich', 'lich_frost_armor'),
        new BuffModel(heroData, 'life_stealer', 'life_stealer_open_wounds'),
        new BuffModel(heroData, 'luna', 'luna_lunar_blessing'),
        new BuffModel(heroData, 'lycan', 'lycan_howl'),
        new BuffModel(heroData, 'magnataur', 'magnataur_empower'),
        new BuffModel(heroData, 'mirana', 'mirana_leap'),
        new BuffModel(heroData, 'ogre_magi', 'ogre_magi_bloodlust'),
        new BuffModel(heroData, 'omniknight', 'omniknight_guardian_angel'),
        new BuffModel(heroData, 'rubick', 'rubick_null_field'),
        new BuffModel(heroData, 'skeleton_king', 'skeleton_king_vampiric_aura'),
        new BuffModel(heroData, 'spirit_breaker', 'spirit_breaker_empowering_haste'),
        new BuffModel(heroData, 'sven', 'sven_warcry'),
        new BuffModel(heroData, 'sven', 'sven_gods_strength'),
        new BuffModel(heroData, 'treant', 'treant_living_armor'),
        new BuffModel(heroData, 'troll_warlord', 'troll_warlord_battle_trance'),
        new BuffModel(heroData, 'vengefulspirit', 'vengefulspirit_command_aura'),
        new BuffModel(heroData, 'npc_dota_neutral_alpha_wolf', 'alpha_wolf_critical_strike'),
        new BuffModel(heroData, 'npc_dota_neutral_alpha_wolf', 'alpha_wolf_command_aura'),
        new BuffModel(heroData, 'npc_dota_neutral_polar_furbolg_ursa_warrior', 'centaur_khan_endurance_aura'),
        new BuffModel(heroData, 'npc_dota_neutral_giant_wolf', 'giant_wolf_critical_strike'),
        new BuffModel(heroData, 'npc_dota_neutral_kobold_taskmaster', 'kobold_taskmaster_speed_aura'),
        new BuffModel(heroData, 'npc_dota_neutral_ogre_magi', 'ogre_magi_frost_armor'),
        new BuffModel(heroData, 'npc_dota_neutral_satyr_hellcaller', 'satyr_hellcaller_unholy_aura'),
        new BuffModel(heroData, 'npc_dota_neutral_enraged_wildkin', 'enraged_wildkin_toughness_aura'),
        new BuffModel(heroData, 'npc_dota_necronomicon_archer_1', 'necronomicon_archer_aoe')
    ];
    return buffOptionsArray.items;
}

buffOptionsArray.init = init;

module.exports = buffOptionsArray;
},{"./BuffModel":3}],5:[function(require,module,exports){
var BuffModel = require("./BuffModel");

var debuffOptionsArray = {};

var init = function (heroData) {
    debuffOptionsArray.items = [
        new BuffModel(heroData, 'abaddon', 'abaddon_frostmourne'),
        new BuffModel(heroData, 'alchemist', 'alchemist_acid_spray'),
        new BuffModel(heroData, 'ancient_apparition', 'ancient_apparition_ice_vortex'),
        new BuffModel(heroData, 'axe', 'axe_battle_hunger'),
        new BuffModel(heroData, 'bane', 'bane_enfeeble'),
        new BuffModel(heroData, 'batrider', 'batrider_sticky_napalm'),
        new BuffModel(heroData, 'beastmaster', 'beastmaster_primal_roar'),
        new BuffModel(heroData, 'bounty_hunter', 'bounty_hunter_jinada'),
        new BuffModel(heroData, 'brewmaster', 'brewmaster_thunder_clap'),
        new BuffModel(heroData, 'brewmaster', 'brewmaster_drunken_haze'),
        new BuffModel(heroData, 'bristleback', 'bristleback_viscous_nasal_goo'),
        new BuffModel(heroData, 'broodmother', 'broodmother_incapacitating_bite'),
        new BuffModel(heroData, 'centaur', 'centaur_stampede'),
        new BuffModel(heroData, 'chen', 'chen_penitence'),
        new BuffModel(heroData, 'crystal_maiden', 'crystal_maiden_crystal_nova'),
        new BuffModel(heroData, 'crystal_maiden', 'crystal_maiden_freezing_field'),
        new BuffModel(heroData, 'dazzle', 'dazzle_weave'),
        new BuffModel(heroData, 'drow_ranger', 'drow_ranger_frost_arrows'),
        new BuffModel(heroData, 'earth_spirit', 'earth_spirit_rolling_boulder'),
        new BuffModel(heroData, 'elder_titan', 'elder_titan_natural_order'),
        new BuffModel(heroData, 'elder_titan', 'elder_titan_earth_splitter'),
        new BuffModel(heroData, 'enchantress', 'enchantress_untouchable'),
        new BuffModel(heroData, 'enchantress', 'enchantress_enchant'),
        new BuffModel(heroData, 'faceless_void', 'faceless_void_time_walk'),
        new BuffModel(heroData, 'huskar', 'huskar_life_break'),
        new BuffModel(heroData, 'invoker', 'invoker_ghost_walk'),
        new BuffModel(heroData, 'invoker', 'invoker_ice_wall'),
        new BuffModel(heroData, 'wisp', 'wisp_tether'),
        new BuffModel(heroData, 'jakiro', 'jakiro_dual_breath'),
        new BuffModel(heroData, 'jakiro', 'jakiro_liquid_fire'),
        new BuffModel(heroData, 'keeper_of_the_light', 'keeper_of_the_light_blinding_light'),
        new BuffModel(heroData, 'kunkka', 'kunkka_torrent'),
        new BuffModel(heroData, 'lich', 'lich_frost_nova'),
        new BuffModel(heroData, 'lich', 'lich_frost_armor'),
        new BuffModel(heroData, 'lich', 'lich_chain_frost'),
        new BuffModel(heroData, 'life_stealer', 'life_stealer_open_wounds'),
        new BuffModel(heroData, 'lion', 'lion_voodoo'),
        new BuffModel(heroData, 'magnataur', 'magnataur_skewer'),
        new BuffModel(heroData, 'medusa', 'medusa_stone_gaze'),
        new BuffModel(heroData, 'meepo', 'meepo_geostrike'),
        new BuffModel(heroData, 'naga_siren', 'naga_siren_rip_tide'),
        new BuffModel(heroData, 'night_stalker', 'night_stalker_void'),
        new BuffModel(heroData, 'night_stalker', 'night_stalker_crippling_fear'),
        new BuffModel(heroData, 'night_stalker', 'night_stalker_darkness'),
        new BuffModel(heroData, 'ogre_magi', 'ogre_magi_ignite'),
        new BuffModel(heroData, 'omniknight', 'omniknight_degen_aura'),
        new BuffModel(heroData, 'phantom_assassin', 'phantom_assassin_stifling_dagger'),
        new BuffModel(heroData, 'phantom_lancer', 'phantom_lancer_spirit_lance'),
        new BuffModel(heroData, 'pudge', 'pudge_rot'),
        new BuffModel(heroData, 'pugna', 'pugna_decrepify'),
        new BuffModel(heroData, 'queenofpain', 'queenofpain_shadow_strike'),
        new BuffModel(heroData, 'riki', 'riki_smoke_screen'),
        new BuffModel(heroData, 'rubick', 'rubick_fade_bolt'),
        new BuffModel(heroData, 'sand_king', 'sandking_epicenter'),
        new BuffModel(heroData, 'nevermore', 'nevermore_dark_lord'),
        new BuffModel(heroData, 'shadow_shaman', 'shadow_shaman_voodoo'),
        new BuffModel(heroData, 'skeleton_king', 'skeleton_king_hellfire_blast'),
        new BuffModel(heroData, 'skeleton_king', 'skeleton_king_reincarnation'),
        new BuffModel(heroData, 'skywrath_mage', 'skywrath_mage_concussive_shot'),
        new BuffModel(heroData, 'skywrath_mage', 'skywrath_mage_ancient_seal'),
        new BuffModel(heroData, 'slardar', 'slardar_slithereen_crush'),
        new BuffModel(heroData, 'slardar', 'slardar_amplify_damage'),
        new BuffModel(heroData, 'slark', 'slark_essence_shift'),
        new BuffModel(heroData, 'sniper', 'sniper_shrapnel'),
        new BuffModel(heroData, 'spectre', 'spectre_spectral_dagger'),
        new BuffModel(heroData, 'storm_spirit', 'storm_spirit_overload'),
        new BuffModel(heroData, 'templar_assassin', 'templar_assassin_meld'),
        new BuffModel(heroData, 'tidehunter', 'tidehunter_gush'),
        new BuffModel(heroData, 'tinker', 'tinker_laser'),
        new BuffModel(heroData, 'treant', 'treant_leech_seed'),
        new BuffModel(heroData, 'tusk', 'tusk_frozen_sigil'),
        new BuffModel(heroData, 'undying', 'undying_flesh_golem'),
        new BuffModel(heroData, 'ursa', 'ursa_earthshock'),
        new BuffModel(heroData, 'vengefulspirit', 'vengefulspirit_wave_of_terror'),
        new BuffModel(heroData, 'vengefulspirit', 'vengefulspirit_command_aura'),
        new BuffModel(heroData, 'venomancer', 'venomancer_venomous_gale'),
        new BuffModel(heroData, 'venomancer', 'venomancer_poison_sting'),
        new BuffModel(heroData, 'viper', 'viper_poison_attack'),
        new BuffModel(heroData, 'viper', 'viper_corrosive_skin'),
        new BuffModel(heroData, 'viper', 'viper_viper_strike'),
        new BuffModel(heroData, 'visage', 'visage_grave_chill'),
        new BuffModel(heroData, 'warlock', 'warlock_upheaval'),
        new BuffModel(heroData, 'weaver', 'weaver_the_swarm'),
        new BuffModel(heroData, 'windrunner', 'windrunner_windrun'),
        new BuffModel(heroData, 'winter_wyvern', 'winter_wyvern_arctic_burn'),
        new BuffModel(heroData, 'winter_wyvern', 'winter_wyvern_splinter_blast'),
        new BuffModel(heroData, 'npc_dota_neutral_ghost', 'ghost_frost_attack'),
        new BuffModel(heroData, 'npc_dota_neutral_polar_furbolg_ursa_warrior', 'polar_furbolg_ursa_warrior_thunder_clap'),
        new BuffModel(heroData, 'npc_dota_neutral_ogre_magi', 'ogre_magi_frost_armor'),
        new BuffModel(heroData, 'npc_dota_neutral_satyr_trickster', 'satyr_trickster_purge'),
        new BuffModel(heroData, 'npc_dota_neutral_enraged_wildkin', 'enraged_wildkin_tornado')
    ];
    return debuffOptionsArray.items;
}

debuffOptionsArray.init = init;

module.exports = debuffOptionsArray;
},{"./BuffModel":3}],6:[function(require,module,exports){
(function (global){
var HeroCalcData = (typeof window !== "undefined" ? window['HeroCalcData'] : typeof global !== "undefined" ? global['HeroCalcData'] : null) || {};
var getJSON = require("../util/getJSON");
var isEmpty = require("../util/isEmpty");
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
        fixHeroData(HeroCalcData.heroData);
        if (callback) callback();
    }
}

var fixHeroData = function (heroData) {
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
}

var init = function (HERODATA_PATH, ITEMDATA_PATH, UNITDATA_PATH, callback) {
    console.log('init HeroCalcData', HeroCalcData);
    resourceCounter = 3;
    
    if (!HeroCalcData.heroData || isEmpty(HeroCalcData.heroData)) {
        if (HERODATA_PATH) {
            getJSON(HERODATA_PATH, function (data) {
                HeroCalcData.heroData = data;
                onResourceLoaded(callback);
            });
        }
    }
    else {
        onResourceLoaded(callback);
    }
    
    if (!HeroCalcData.itemData || isEmpty(HeroCalcData.itemData)) {
        if (ITEMDATA_PATH) {
            getJSON(ITEMDATA_PATH, function (data) {
                HeroCalcData.itemData = data;
                onResourceLoaded(callback);
            });
        }
    }
    else {
        onResourceLoaded(callback);
    }
    
    if (!HeroCalcData.unitData || isEmpty(HeroCalcData.unitData)) {
        if (UNITDATA_PATH) {
            getJSON(UNITDATA_PATH, function (data) {
                HeroCalcData.unitData = data;
                onResourceLoaded(callback);
            });
        }
    }
    else {
        onResourceLoaded(callback);
    }
}
    
HeroCalcData.init = init;

module.exports = HeroCalcData;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../util/getJSON":34,"../util/isEmpty":35}],7:[function(require,module,exports){
'use strict';
var HeroModel = require("./HeroModel");

var CloneModel = function (heroData, itemData, h,p) {
    var self = this;
    HeroModel.call(this, heroData, itemData, h);
    self.parent = p;
    return self;
}
CloneModel.prototype = Object.create(HeroModel.prototype);
CloneModel.prototype.constructor = CloneModel;

module.exports = CloneModel;
},{"./HeroModel":10}],8:[function(require,module,exports){
var DamageTypeColor = {
    'physical': '#979aa2',
    'pure': 'goldenrod',
    'magic': '#428bca',
    'default': '#979aa2'
}

module.exports = DamageTypeColor;
},{}],9:[function(require,module,exports){
'use strict';
var ko = require('../herocalc_knockout');
    
var DamageTypeColor = require("./DamageTypeColor");
var extend = require("../util/extend");

var HeroDamageMixin = function (self, itemData) {
    self.critInfo = ko.pureComputed(function () {
        var critSources = self.inventory.getCritSource();
        extend(critSources, self.ability().getCritSource());
        extend(critSources, self.buffs.getCritSource());
        var critSourcesArray = [];
        for (var prop in critSources) {
            var el = critSources[prop];
            el.name = prop
            critSourcesArray.push(el);
        }
        function compareByMultiplier(a,b) {
            if (a.multiplier < b.multiplier)
                return 1;
            if (a.multiplier > b.multiplier)
                return -1;
            return 0;
        }

        critSourcesArray.sort(compareByMultiplier);
        
        var result = [];
        var critTotal = 0;
        for (var i = 0; i < critSourcesArray.length; i++) {
            var total = 1;
            for (var j = 0; j < i; j++) {
                for (var k = 0; k <critSourcesArray[j].count; k++) {
                    total *= (1 - critSourcesArray[j].chance);
                }
            }
            var total2 = 1;
            for (var k = 0; k < critSourcesArray[i].count; k++) {
                total2 *= (1 - critSourcesArray[i].chance);
            }
            total *= (1 - total2);
            critTotal += total;
            if (critSourcesArray[i].count > 1) {
                result.push({
                    'name':critSourcesArray[i].displayname + ' x' + critSourcesArray[i].count,
                    'chance':critSourcesArray[i].chance,
                    'multiplier':critSourcesArray[i].multiplier,
                    'count':critSourcesArray[i].count,
                    'totalChance':total
                });
            }
            else {
                result.push({
                    'name':critSourcesArray[i].displayname,
                    'chance':critSourcesArray[i].chance,
                    'multiplier':critSourcesArray[i].multiplier,
                    'count':critSourcesArray[i].count,
                    'totalChance':total
                });
            }
        }
        return { sources: result, total: critTotal };
    });

    self.cleaveInfo = ko.pureComputed(function () {
        var cleaveSources = self.inventory.getCleaveSource();
        extend(cleaveSources, self.ability().getCleaveSource());
        extend(cleaveSources, self.buffs.getCleaveSource());
        var cleaveSourcesArray = [];
        for (var prop in cleaveSources) {
            var el = cleaveSources[prop];
            el.name = prop
            cleaveSourcesArray.push(el);
        }
        function compareByRadius(a,b) {
            if (a.radius < b.radius)
                return 1;
            if (a.radius > b.radius)
                return -1;
            return 0;
        }

        cleaveSourcesArray.sort(compareByRadius);
        var cleaveSourcesByRadius = {};
        for (var i = 0; i < cleaveSourcesArray.length; i++) {
            var total = 0;
            for (var j = 0; j <cleaveSourcesArray.length; j++) {
                if (cleaveSourcesArray[j].radius >= cleaveSourcesArray[i].radius) {
                    total += cleaveSourcesArray[j].magnitude * cleaveSourcesArray[j].count;
                }
            }
            cleaveSourcesByRadius[cleaveSourcesArray[i].radius] = total;
        }
        var result = [];
        for (var prop in cleaveSourcesByRadius) {
            result.push({
                'radius':prop,
                'magnitude':cleaveSourcesByRadius[prop]
            });
        }
        return result;
    });
    
    self.bashInfo = ko.pureComputed(function () {
        var attacktype = self.heroData().attacktype;
        var bashSources = self.inventory.getBashSource(attacktype);
        extend(bashSources, self.ability().getBashSource());
        var bashSourcesArray = [];
        for (var prop in bashSources) {
            var el = bashSources[prop];
            el.name = prop
            bashSourcesArray.push(el);
        }
        function compareByDuration(a, b) {
            if (a.duration < b.duration)
                return 1;
            if (a.duration > b.duration)
                return -1;
            return 0;
        }

        //bashSourcesArray.sort(compareByDuration);
        
        var result = [];
        var bashTotal = 0;
        for (var i = 0;i < bashSourcesArray.length; i++) {
            var total = 1;
            for (var j = 0; j < i; j++) {
                for (var k = 0; k < bashSourcesArray[j].count; k++) {
                    total *= (1 - bashSourcesArray[j].chance);
                }
            }
            var total2 = 1;
            for (var k = 0; k < bashSourcesArray[i].count; k++) {
                total2 *= (1 - bashSourcesArray[i].chance);
            }
            total *= (1 - total2);
            bashTotal += total;
            if (bashSourcesArray[i].name === 'spirit_breaker_greater_bash') {
                var d = bashSourcesArray[i].damage * self.totalMovementSpeed();
            }
            else {
                var d = bashSourcesArray[i].damage;
            }
            if (bashSourcesArray[i].count > 1) {
                result.push({
                    'name':bashSourcesArray[i].displayname, // + ' x' + bashSourcesArray[i].count,
                    'chance':bashSourcesArray[i].chance,
                    'damage':d,
                    'count':bashSourcesArray[i].count,
                    'damageType':bashSourcesArray[i].damageType,
                    'totalChance':total
                });
            }
            else {
                result.push({
                    'name':bashSourcesArray[i].displayname,
                    'chance':bashSourcesArray[i].chance,
                    'damage':d,
                    'count':bashSourcesArray[i].count,
                    'damageType':bashSourcesArray[i].damageType,
                    'totalChance':total
                });
            }

        }
        return { sources: result, total: bashTotal };
    });
    
    self.orbProcInfo = ko.pureComputed(function () {
        var attacktype = self.heroData().attacktype;
        var damageSources = self.inventory.getOrbProcSource();
        var damageSourcesArray = [];
        for (var prop in damageSources) {
            var el = damageSources[prop];
            el.name = prop
            damageSourcesArray.push(el);
        }
        function compareByDamage(a, b) {
            if (a.priority > b.priority) {
                return 1;
            }
            if (a.priority < b.priority) {
                return -1;
            }
            if (a.damage < b.damage)
                return 1;
            if (a.damage > b.damage)
                return -1;
            return 0;
        }

        damageSourcesArray.sort(compareByDamage);
        
        var result = [];
        var damageTotal = 0;
        for (var i=0 ; i < damageSourcesArray.length; i++) {
            var total = 1;
            for (var j = 0; j < i; j++) {
                for (var k = 0; k < damageSourcesArray[j].count; k++) {
                    total *= (1 - damageSourcesArray[j].chance);
                }
            }
            var total2 = 1;
            for (var k = 0; k < damageSourcesArray[i].count; k++) {
                total2 *= (1 - damageSourcesArray[i].chance);
            }
            total *= (1 - total2);
            damageTotal += total;
            if (damageSourcesArray[i].count > 1) {
                result.push({
                    'name':damageSourcesArray[i].displayname + ' x' + damageSourcesArray[i].count,
                    'chance':damageSourcesArray[i].chance,
                    'damage':damageSourcesArray[i].damage,
                    'count':damageSourcesArray[i].count,
                    'damageType':damageSourcesArray[i].damageType,
                    'totalChance':total
                });
            }
            else {
                result.push({
                    'name':damageSourcesArray[i].displayname,
                    'chance':damageSourcesArray[i].chance,
                    'damage':damageSourcesArray[i].damage,
                    'count':damageSourcesArray[i].count,
                    'damageType':damageSourcesArray[i].damageType,
                    'totalChance':total
                });
            }
        }
        return { sources: result, total: damageTotal };
    });
    
    self.getReducedDamage = function (value, type) {
        var result = value;
        switch (type) {
            case 'physical':
                result = value * (1 - (0.06 * self.enemy().totalArmorPhysical()) / (1 + 0.06 * Math.abs(self.enemy().totalArmorPhysical())));
            break;
            case 'magic':
                result = value * (1 - self.enemy().totalMagicResistance() / 100);
            break;
            case 'pure':
                result = value;
            break;
            case 'composite':
                result = value * (1 - (0.06 * self.enemy().totalArmorPhysical()) / (1 + 0.06 * Math.abs(self.enemy().totalArmorPhysical())));
                result *= (1 - self.enemy().totalMagicResistance() / 100);
            break;
        }
        result *= self.ability().getDamageAmplification() * self.debuffs.getDamageAmplification();
        result *= self.enemy().ability().getDamageReduction() * self.enemy().buffs.getDamageReduction();
        return result;
    }
    
    self.damageTotalInfo = ko.pureComputed(function () {
        var bonusDamageArray = [
            self.ability().getBonusDamage().sources,
            self.buffs.getBonusDamage().sources
        ],
        bonusDamagePctArray = [
            self.ability().getBonusDamagePercent().sources,
            self.buffs.getBonusDamagePercent().sources
        ],
        itemBonusDamage = self.inventory.getBonusDamage().sources,
        itemBonusDamagePct = self.buffs.itemBuffs.getBonusDamagePercent(self.inventory.getBonusDamagePercent()).sources,
        critSources = self.critInfo(),
        abilityOrbSources = self.ability().getOrbSource(),
        itemOrbSources = self.inventory.getOrbSource(),
        itemProcOrbSources = self.orbProcInfo(),
        bashSources = self.bashInfo(),
        
        attackSources = [];
        
        attackSources.push({
            name: 'Base Attack',
            cooldown: 1
        });
        
        // weaver_geminate_attack
        if (self.heroId() === 'weaver') {
            var a = self.ability().abilities().find(function (ability) {
                return ability.name === 'weaver_geminate_attack';
            });
            if (a) {
                if (a.level() > 0) {
                    var cd = a.cooldown[a.level() - 1];
                    attackSources.push({
                        name: a.displayname,
                        cooldown: (1/cd)
                    });
                }
            }
        }
        
        // echo_sabre
        var item = self.inventory.items().find(function (o) { return o.item === "echo_sabre" && o.enabled(); });
        if (item && self.heroData().attacktype === 'DOTA_UNIT_CAP_MELEE_ATTACK') {
            var item_echo_sabre = itemData['item_echo_sabre'];
            attackSources.push({
                name: item_echo_sabre.displayname,
                cooldown: (1/item_echo_sabre.cooldown)
            });
        }

        var attacks = attackSources.map(function (a) {
            var baseDamage = (self.baseDamage()[0] + self.baseDamage()[1]) / 2,
            totalDamage = 0,
            totalCritableDamage = 0,
            totalCrit = 0,
            geminateAttack = { damage: 0, damageReduced: 0, cooldown: 6, active: false },
            echoSabreAttack = { damage: 0, damageReduced: 0, cooldown: itemData['item_echo_sabre'].cooldown[0], active: false },
            damage = {
                pure: 0,
                physical: 0,
                magic: 0
            },
            result = [],
            crits = [];
            
            // base damage
            result.push({
                name: 'Base Damage',
                damage: baseDamage,
                damageType: 'physical',
                damageReduced: self.getReducedDamage(baseDamage, 'physical'),
                enabled: ko.observable(true)
            });
            totalDamage += baseDamage;
            totalCritableDamage += baseDamage;
            damage.physical += baseDamage;
            
            // bonus damage from items
            for (i in itemBonusDamage) {
                var d = itemBonusDamage[i].damage*itemBonusDamage[i].count * self.ability().getSelfBaseDamageReductionPct() * self.enemy().ability().getBaseDamageReductionPct() * self.debuffs.itemBuffs.getBaseDamageReductionPct();
                result.push({
                    name: itemBonusDamage[i].displayname + (itemBonusDamage[i].count > 1 ? ' x' + itemBonusDamage[i].count : ''),
                    damage: d,
                    damageType: itemBonusDamage[i].damageType,
                    damageReduced: self.getReducedDamage(d, itemBonusDamage[i].damageType),
                    enabled: ko.observable(true)
                });
                totalDamage += d;
                totalCritableDamage += d;
                damage[itemBonusDamage[i].damageType] += d;
            }

            // bonus damage percent from items
            for (i in itemBonusDamagePct) {
                var d = baseDamage * itemBonusDamagePct[i].damage;
                result.push({
                    name: itemBonusDamagePct[i].displayname,
                    damage: d,
                    damageType: itemBonusDamagePct[i].damageType,
                    damageReduced: self.getReducedDamage(d, itemBonusDamagePct[i].damageType),
                    enabled: ko.observable(true)
                });
                totalDamage += d;
                totalCritableDamage += d;
                damage[itemBonusDamagePct[i].damageType] += d;
            }
            
            // bonus damage from abilities and buffs
            for (var i = 0; i < bonusDamageArray.length; i++) {
                for (j in bonusDamageArray[i]) {
                    var d = bonusDamageArray[i][j].damage;
                    result.push({
                        name: bonusDamageArray[i][j].displayname,
                        damage: d,
                        damageType: bonusDamageArray[i][j].damageType,
                        damageReduced: self.getReducedDamage(d, bonusDamageArray[i][j].damageType),
                        enabled: ko.observable(true)
                    });
                    totalDamage += d;
                    totalCritableDamage += d;
                    damage[bonusDamageArray[i][j].damageType] += d;
                }
            }
            
            // bonus damage percent from abilities and buffs
            for (var i = 0; i < bonusDamagePctArray.length; i++) {
                for (j in bonusDamagePctArray[i]) {
                    var d = baseDamage * bonusDamagePctArray[i][j].damage;
                    result.push({
                        name: bonusDamagePctArray[i][j].displayname,
                        damage: d,
                        damageType: bonusDamagePctArray[i][j].damageType,
                        damageReduced: self.getReducedDamage(d, bonusDamagePctArray[i][j].damageType),
                        enabled: ko.observable(true)
                    });
                    totalDamage += d;
                    totalCritableDamage += d;
                    damage[bonusDamagePctArray[i][j].damageType] += d;
                }
            }
            // drow_ranger_trueshot
            if (self.heroData().attacktype === 'DOTA_UNIT_CAP_RANGED_ATTACK') {
                if (self.heroId() === 'drow_ranger') {
                    var s = self.ability().getBonusDamagePrecisionAura().sources;
                    var index = 0;
                }
                else {
                    var s = self.buffs.getBonusDamagePrecisionAura().sources;
                    var index = 1;
                }
                if (s[index] != undefined) {
                    if (self.heroId() === 'drow_ranger') {
                        var d = s[index].damage * self.totalAgi();
                    }
                    else {
                        var d = s[index].damage;
                    }
                    result.push({
                        name: s[index].displayname,
                        damage: d,
                        damageType: 'physical',
                        damageReduced: self.getReducedDamage(d, 'physical'),
                        enabled: ko.observable(true)
                    });
                    totalDamage += d;
                    totalCritableDamage += d;
                    damage.physical += d;                    
                }
            }
            
            // riki_backstab
            if (self.heroId() === 'riki') {
                var s = self.ability().getBonusDamageBackstab().sources;
                var index = 0;
            }
            else {
                var s = self.buffs.getBonusDamageBackstab().sources;
                var index = 1;
            }
            if (s[index] != undefined) {
                if (self.heroId() === 'riki') {
                    var d = s[index].damage * self.totalAgi();
                }
                else {
                    var d = s[index].damage;
                }
                result.push({
                    name: s[index].displayname,
                    damage: d,
                    damageType: 'physical',
                    damageReduced: self.getReducedDamage(d, 'physical'),
                    enabled: ko.observable(true)
                });
                totalDamage += d;
                //totalCritableDamage += d;
                damage.physical += d;                    
            }

            // bash damage
            for (var i = 0; i < bashSources.sources.length; i++) {
                var o = bashSources.sources[i];
                var d = bashSources.sources[i].damage;
                var cd = self.attacksPerSecond();
                if (o.cooldown) {
                    cd = Math.max(1/o.cooldown, cd);
                }
                for (var j = 0; j < bashSources.sources[i].count; j++) {
                    result.push({
                        name: bashSources.sources[i].name,
                        damage: d,
                        damageType: bashSources.sources[i].damageType,
                        damageReduced: self.getReducedDamage(d, bashSources.sources[i].damageType),
                        dps: d * cd * bashSources.sources[i].chance,
                        dpsReduced: self.getReducedDamage(d, bashSources.sources[i].damageType) * cd * bashSources.sources[i].chance,
                        enabled: ko.observable(true)
                    });
                    totalDamage += d;
                    damage[bashSources.sources[i].damageType] += d;
                }

            }
            
            // %-based orbs
            for (var i = 0; i < itemProcOrbSources.sources.length; i++) {
                var d = itemProcOrbSources.sources[i].damage * (1 - Math.pow(1 - itemProcOrbSources.sources[i].chance, itemProcOrbSources.sources[i].count));
                result.push({
                    name: itemProcOrbSources.sources[i].name,
                    damage: d,
                    damageType: itemProcOrbSources.sources[i].damageType,
                    damageReduced: self.getReducedDamage(d, itemProcOrbSources.sources[i].damageType),
                    enabled: ko.observable(true)
                });
                totalDamage += d;
                damage[itemProcOrbSources.sources[i].damageType] += d;
            }
            
            // ability orbs
            for (var orb in abilityOrbSources) {
                var d = abilityOrbSources[orb].damage * (1 - itemProcOrbSources.total);
                result.push({
                    name: abilityOrbSources[orb].displayname,
                    damage: d,
                    damageType: abilityOrbSources[orb].damageType,
                    damageReduced: self.getReducedDamage(d, abilityOrbSources[orb].damageType),
                    enabled: ko.observable(true)
                });
                totalDamage += d;
                damage[abilityOrbSources[orb].damageType] += d;
            }
            
            // item orbs
            if (Object.keys(abilityOrbSources).length === 0) {
                for (var orb in itemOrbSources) {
                    var d = itemOrbSources[orb].damage * (1 - itemProcOrbSources.total);
                    result.push({
                        name: itemOrbSources[orb].displayname,
                        damage: d,
                        damageType: itemOrbSources[orb].damageType,
                        damageReduced: self.getReducedDamage(d, itemOrbSources[orb].damageType),
                        enabled: ko.observable(true)
                    });
                    totalDamage += d;
                    damage[itemOrbSources[orb].damageType] += d;
                }            
            }
            
            // crit damage
            for (var i = 0; i < critSources.sources.length; i++) {
                var d = totalCritableDamage * (critSources.sources[i].multiplier - 1);// * critSources.sources[i].totalChance;
                crits.push({
                    name: critSources.sources[i].name + ', ' + critSources.sources[i].multiplier + 'x, ' + (critSources.sources[i].totalChance * 100).toFixed(1) + '%',
                    damage: d,
                    damageType: 'physical',
                    damageReduced: self.getReducedDamage(d, 'physical'),
                    enabled: ko.observable(true),
                    chance: critSources.sources[i].totalChance
                });
                totalCrit += d;
            }

            var totalReduced = self.getReducedDamage(damage.pure, 'pure') 
                    + self.getReducedDamage(damage.physical, 'physical')
                    + self.getReducedDamage(damage.magic, 'magic'),
                totalCritReduced = self.getReducedDamage(totalCrit, 'physical'),
                dps = {
                    base: totalDamage * self.attacksPerSecond(),
                    crit: totalCrit * self.attacksPerSecond(),
                    geminateAttack: geminateAttack.active ? geminateAttack.damage / geminateAttack.cooldown : 0,
                    reduced: {
                        base: totalReduced * self.attacksPerSecond(),
                        crit: totalCritReduced * self.attacksPerSecond(),
                        geminateAttack: geminateAttack.active ? self.getReducedDamage(geminateAttack.damage, 'physical') / geminateAttack.cooldown : 0,
                    }
                }
                
            crits.forEach(function (o) {
                if (!o.dps) {
                    o.dps = o.damage * (o.cooldown || self.attacksPerSecond()) * o.chance;
                }
                if (!o.dpsReduced) {
                    o.dpsReduced = o.damageReduced * (o.cooldown || self.attacksPerSecond()) * o.chance;
                }
            });
                
            result.forEach(function (o) {
                if (!o.dps) {
                    o.dps = o.damage * (o.cooldown || self.attacksPerSecond());
                }
                if (!o.dpsReduced) {
                    o.dpsReduced = o.damageReduced * (o.cooldown || self.attacksPerSecond());
                }
            });
            
            var totalCritChance = crits.reduce(function (memo, o) { return memo + o.chance }, 0);
                
            var t1Crit = ko.computed(function () {
                var c = crits.find(function (o) { return o.enabled(); });
                return c ? c.damage : 0;
            });
            var t2Crit = ko.computed(function () {
                var c = crits.find(function (o) { return o.enabled(); });
                return c ? c.damageReduced : 0;
            });
            var t3Crit = ko.computed(function () {
                return crits.filter(function (o) { return o.enabled(); }).reduce(function (memo, o) { return memo + o.dps }, 0);
            });
            var t4Crit = ko.computed(function () {
                return crits.filter(function (o) { return o.enabled(); }).reduce(function (memo, o) { return memo + o.dpsReduced }, 0);
            });
                
            var t1 = ko.computed(function () {
                return result.filter(function (o) { return o.enabled(); }).reduce(function (memo, o) { return memo + o.damage }, 0) + t1Crit();
            });
            var t2 = ko.computed(function () {
                return result.filter(function (o) { return o.enabled(); }).reduce(function (memo, o) { return memo + o.damageReduced }, 0) + t2Crit();
            });
            var t3 = ko.computed(function () {
                return (result.filter(function (o) { return o.enabled(); }).reduce(function (memo, o) { return memo + o.dps }, 0) + t3Crit()) * a.cooldown;
            });
            var t4 = ko.computed(function () {
                return (result.filter(function (o) { return o.enabled(); }).reduce(function (memo, o) { return memo + o.dpsReduced }, 0) + t4Crit()) * a.cooldown;
            });
            
            var totalCritRow = [t1Crit, t2Crit, t3Crit, t4Crit];
            
            var totalRow = [t1, t2, t3, t4];

            return {
                name: a.name + ' Subtotal',
                cooldown: a.cooldown,
                enabled: ko.observable(true),
                visible: ko.observable(true),
                totalCritChance: totalCritChance,
                totalCritRow: totalCritRow,
                totalRow: totalRow,
                sources: result,
                sourcesCrit: crits,
                total: totalDamage,
                totalCrit: totalCrit,
                totalGeminateAttack: totalDamage + geminateAttack.damage,
                totalGeminateAttackReduced: totalReduced + geminateAttack.damageReduced,
                geminateAttack: geminateAttack,
                totalCritReduced: totalCritReduced,
                totalReduced: totalReduced,
                sumTotal: totalDamage + totalCrit,
                sumTotalReduced: totalReduced + totalCritReduced,
                dps: {
                    base: dps.base,
                    crit: dps.base + dps.crit,
                    geminateAttack: dps.base + dps.geminateAttack,
                    total: dps.base + dps.crit + dps.geminateAttack,
                    reduced: {
                        base: dps.reduced.base,
                        crit: dps.reduced.base + dps.reduced.crit,
                        geminateAttack: dps.reduced.base + dps.reduced.geminateAttack,
                        total: dps.reduced.base + dps.reduced.crit + dps.reduced.geminateAttack
                    }
                }
            };
        });
        
        var t1 = ko.computed(function () {
            return attacks.filter(function (o) { return o.enabled(); }).reduce(function (memo, o) { return memo + o.totalRow[0]() }, 0);
        });
        var t2 = ko.computed(function () {
            return attacks.filter(function (o) { return o.enabled(); }).reduce(function (memo, o) { return memo + o.totalRow[1]() }, 0);
        });
        var t3 = ko.computed(function () {
            return attacks.filter(function (o) { return o.enabled(); }).reduce(function (memo, o) { return memo + o.totalRow[2]() }, 0);
        });
        var t4 = ko.computed(function () {
            return attacks.filter(function (o) { return o.enabled(); }).reduce(function (memo, o) { return memo + o.totalRow[3]() }, 0);
        });
            
        return {
            attacks: attacks,
            totalRow: [t1, t2, t3, t4]
        }
    });
    
    self.getDamageTypeColor = function (damageType) {
        return DamageTypeColor[damageType] || DamageTypeColor['default'];
    }
    
}

module.exports = HeroDamageMixin;
},{"../herocalc_knockout":19,"../util/extend":32,"./DamageTypeColor":8}],10:[function(require,module,exports){
'use strict';
var ko = require('../herocalc_knockout');

var AbilityModel = require("../AbilityModel");
var BuffViewModel = require("../BuffViewModel");
var InventoryViewModel = require("../inventory/InventoryViewModel");
var diffProperties = require("./diffProperties");
var HeroDamageMixin = require("./HeroDamageMixin");

var totalExp = require("./totalExp");
var nextLevelExp = require("./nextLevelExp");

var HeroModel = function (heroData, itemData, h) {
    var self = this;
    self.heroId = ko.observable(h);
    self.selectedHeroLevel = ko.observable(1);
    self.inventory = new InventoryViewModel(itemData, self);
    self.selectedInventory = ko.observable(-1);
    self.buffs = new BuffViewModel(itemData);
    self.buffs.hasScepter = self.inventory.hasScepter;
    self.debuffs = new BuffViewModel(itemData);
    self.heroData = ko.computed(function () {
      return heroData['npc_dota_hero_' + self.heroId()];
    });
    self.heroCompare = ko.observable(self);
    self.enemy = ko.observable(self);
    self.unit = ko.observable(self);
    self.clone = ko.observable(self);
    
    self.skillPointHistory = ko.observableArray();
    
    self.ability = ko.computed(function () {
        var a = new AbilityModel(ko.observableArray(JSON.parse(JSON.stringify(self.heroData().abilities))), self);
        switch (self.heroId()) {
            case 'earth_spirit':
            case 'ogre_magi':
                a._abilities[3].level(1);
            break;
            case 'invoker':
                for (var i = 6; i < 16; i++) {
                    a._abilities[i].level(1);
                }
            break;
        }
        self.skillPointHistory.removeAll();
        a.hasScepter = self.inventory.hasScepter
        return a;
    });

    self.availableSkillPoints = ko.computed(function () {
        var c = self.selectedHeroLevel();
        for (var i = 0; i < self.ability().abilities().length; i++) {
            switch(self.ability().abilities()[i].abilitytype) {
                case 'DOTA_ABILITY_TYPE_ULTIMATE':
                    if (self.heroId() === 'invoker') {
                        while (
                            ((self.ability().abilities()[i].level() == 1) && (parseInt(self.selectedHeroLevel()) < 2)) ||
                            ((self.ability().abilities()[i].level() == 2) && (parseInt(self.selectedHeroLevel()) < 7)) ||
                            ((self.ability().abilities()[i].level() == 3) && (parseInt(self.selectedHeroLevel()) < 11)) ||
                            ((self.ability().abilities()[i].level() == 4) && (parseInt(self.selectedHeroLevel()) < 17))
                        ) {
                            self.ability().levelDownAbility(i, null, null, self);
                        }
                    }
                    else if (self.heroId() === 'meepo') {
                        while ((self.ability().abilities()[i].level()-1) * 7 + 3 > parseInt(self.selectedHeroLevel())) {
                            self.ability().levelDownAbility(i, null, null, self);
                        }
                    }
                    else {
                        while (self.ability().abilities()[i].level() * 5 + 1 > parseInt(self.selectedHeroLevel())) {
                            self.ability().levelDownAbility(i, null, null, self);
                        }
                    }
                break;
                default:
                    while (self.ability().abilities()[i].level() * 2 - 1 > parseInt(self.selectedHeroLevel())) {
                        self.ability().levelDownAbility(i, null, null, self);
                    }
                break;
            }
        }
        while (self.skillPointHistory().length > c) {
            self.ability().levelDownAbility(self.skillPointHistory()[self.skillPointHistory().length-1], null, null, self);
        }
        return c-self.skillPointHistory().length;
    }, this);
    self.primaryAttribute = ko.pureComputed(function () {
        var v = self.heroData().attributeprimary;
        if (v === 'DOTA_ATTRIBUTE_AGILITY') return 'agi';
        if (v === 'DOTA_ATTRIBUTE_INTELLECT') return 'int';
        if (v === 'DOTA_ATTRIBUTE_STRENGTH') return 'str';
        return '';
    });
    self.totalExp = ko.pureComputed(function () {
        return totalExp[self.selectedHeroLevel() - 1];
    });
    self.nextLevelExp = ko.pureComputed(function () {
        return nextLevelExp[self.selectedHeroLevel() - 1];
    });
    self.startingArmor = ko.pureComputed(function () {
        return (self.heroData().attributebaseagility * .14 + self.heroData().armorphysical).toFixed(2);
    });
    self.respawnTime = ko.pureComputed(function () {
        return 5 + 3.8 * self.selectedHeroLevel();
    });
    self.totalAttribute = function (a) {
        if (a === 'agi') return parseFloat(self.totalAgi());
        if (a === 'int') return parseFloat(self.totalInt());
        if (a === 'str') return parseFloat(self.totalStr());
        return 0;
    };
    self.totalAgi = ko.pureComputed(function () {
        return (self.heroData().attributebaseagility
                + self.heroData().attributeagilitygain * (self.selectedHeroLevel() - 1) 
                + self.inventory.getAttributes('agi') 
                + self.ability().getAttributeBonusLevel() * 2
                + self.ability().getAgility()
                + self.enemy().ability().getAllStatsReduction()
                + self.debuffs.getAllStatsReduction()
               ).toFixed(2);
    });
    self.intStolen = ko.observable(0).extend({ numeric: 0 });
    self.totalInt = ko.pureComputed(function () {
        return (self.heroData().attributebaseintelligence 
                + self.heroData().attributeintelligencegain * (self.selectedHeroLevel() - 1) 
                + self.inventory.getAttributes('int') 
                + self.ability().getAttributeBonusLevel() * 2
                + self.ability().getIntelligence()
                + self.enemy().ability().getAllStatsReduction()
                + self.debuffs.getAllStatsReduction() + self.intStolen()
               ).toFixed(2);
    });
    self.totalStr = ko.pureComputed(function () {
        return (self.heroData().attributebasestrength 
                + self.heroData().attributestrengthgain * (self.selectedHeroLevel() - 1) 
                + self.inventory.getAttributes('str') 
                + self.ability().getAttributeBonusLevel() * 2
                + self.ability().getStrength()
                + self.enemy().ability().getStrengthReduction()
                + self.enemy().ability().getAllStatsReduction()
                + self.debuffs.getAllStatsReduction()
               ).toFixed(2);
    });
    self.health = ko.pureComputed(function () {
        return (self.heroData().statushealth + Math.floor(self.totalStr()) * 20 
                + self.inventory.getHealth()
                + self.ability().getHealth()).toFixed(2);
    });
    self.healthregen = ko.pureComputed(function () {
        var healthRegenAura = [self.inventory.getHealthRegenAura, self.buffs.itemBuffs.getHealthRegenAura].reduce(function (memo, fn) {
            var obj = fn(memo.excludeList);
            obj.value += memo.value;
            return obj;
        }, {value: 0, excludeList: []});
        return (self.heroData().statushealthregen + self.totalStr() * .03 
                + self.inventory.getHealthRegen() 
                + self.ability().getHealthRegen()
                + self.buffs.getHealthRegen()
                + healthRegenAura.value
                ).toFixed(2);
    });
    self.mana = ko.pureComputed(function () {
        return (self.heroData().statusmana
                + self.totalInt() * 12
                + self.inventory.getMana()
                + self.ability().getMana()).toFixed(2);
    });
    self.manaregen = ko.pureComputed(function () {
        return ((self.heroData().statusmanaregen 
                + self.totalInt() * .04 
                + self.ability().getManaRegen()) 
                * (1 + self.inventory.getManaRegenPercent()) 
                + (self.heroId() === 'crystal_maiden' ? self.ability().getManaRegenArcaneAura() * 2 : self.buffs.getManaRegenArcaneAura())
                + self.inventory.getManaRegenBloodstone()
                + self.inventory.getManaRegen()
                - self.enemy().ability().getManaRegenReduction()).toFixed(2);
    });
    self.totalArmorPhysical = ko.pureComputed(function () {
        var armorAura = [self.inventory.getArmorAura, self.buffs.itemBuffs.getArmorAura].reduce(function (memo, fn) {
            var obj = fn(memo.attributes);
            return obj;
        }, {value:0, attributes:[]});
        var armorReduction = [self.enemy().inventory.getArmorReduction, self.debuffs.itemBuffs.getArmorReduction].reduce(function (memo, fn) {
            var obj = fn(memo.excludeList);
            obj.value += memo.value;
            return obj;
        }, {value: 0, excludeList: []});
        return (self.enemy().ability().getArmorBaseReduction() * self.debuffs.getArmorBaseReduction() * (self.heroData().armorphysical + self.totalAgi() * .14)
                + self.inventory.getArmor()
                //+ self.inventory.getArmorAura().value
                //+ self.enemy().inventory.getArmorReduction()
                + self.ability().getArmor()
                + self.enemy().ability().getArmorReduction()
                + self.buffs.getArmor()
                + self.buffs.itemBuffs.getArmor()
                + self.debuffs.getArmorReduction()
                //+ self.buffs.itemBuffs.getArmorAura().value
                + armorAura.value
                + armorReduction.value
                //+ self.debuffs.getArmorReduction()
                ).toFixed(2);
    });
    self.totalArmorPhysicalReduction = ko.pureComputed(function () {
        var totalArmor = self.totalArmorPhysical();
        if (totalArmor >= 0) {
            return ((0.06 * self.totalArmorPhysical()) / (1 + 0.06 * self.totalArmorPhysical()) * 100).toFixed(2);
        }
        else {
            return -((0.06 * -self.totalArmorPhysical()) / (1 + 0.06 * -self.totalArmorPhysical()) * 100).toFixed(2);
        }
    });
    self.totalMovementSpeed = ko.pureComputed(function () {
        var MIN_MOVESPEED = 100;
        var ms = (self.ability().setMovementSpeed() > 0 ? self.ability().setMovementSpeed() : self.buffs.setMovementSpeed());
        if (ms > 0) {
            return ms;
        }
        else {
            var movementSpeedPercent = [self.inventory.getMovementSpeedPercent, self.buffs.itemBuffs.getMovementSpeedPercent].reduce(function (memo, fn) {
                var obj = fn(memo.excludeList);
                obj.value += memo.value;
                return obj;
            }, {value:0, excludeList:[]});
            var movementSpeedPercentReduction = [self.enemy().inventory.getMovementSpeedPercentReduction, self.debuffs.itemBuffs.getMovementSpeedPercentReduction].reduce(function (memo, fn) {
                var obj = fn(memo.excludeList);
                obj.value += memo.value;
                return obj;
            }, {value:0, excludeList:[]});
            return Math.max(
                self.enemy().inventory.isSheeped() || self.debuffs.itemBuffs.isSheeped() ? 140 :
                (self.heroData().movementspeed + self.inventory.getMovementSpeedFlat()+ self.ability().getMovementSpeedFlat()) * 
                (1 //+ self.inventory.getMovementSpeedPercent() 
                   + movementSpeedPercent.value
                   + movementSpeedPercentReduction.value
                   + self.ability().getMovementSpeedPercent() 
                   //+ self.enemy().inventory.getMovementSpeedPercentReduction() 
                   + self.enemy().ability().getMovementSpeedPercentReduction() 
                   + self.buffs.getMovementSpeedPercent() 
                   + self.debuffs.getMovementSpeedPercentReduction()
                   + self.unit().ability().getMovementSpeedPercent() 
                )
            , MIN_MOVESPEED).toFixed(2);
        }
    });
    self.totalTurnRate = ko.pureComputed(function () {
        return (self.heroData().movementturnrate 
                * (1 + self.enemy().ability().getTurnRateReduction()
                     + self.debuffs.getTurnRateReduction())).toFixed(2);
    });
    self.baseDamage = ko.pureComputed(function () {
        var totalAttribute = self.totalAttribute(self.primaryAttribute()),
            abilityBaseDamage = self.ability().getBaseDamage(),
            minDamage = self.heroData().attackdamagemin,
            maxDamage = self.heroData().attackdamagemax;
        return [Math.floor((minDamage + totalAttribute + abilityBaseDamage.total) * self.ability().getSelfBaseDamageReductionPct() * self.enemy().ability().getBaseDamageReductionPct() * self.debuffs.getBaseDamageReductionPct() * self.debuffs.itemBuffs.getBaseDamageReductionPct() * abilityBaseDamage.multiplier),
                Math.floor((maxDamage + totalAttribute + abilityBaseDamage.total) * self.ability().getSelfBaseDamageReductionPct() * self.enemy().ability().getBaseDamageReductionPct() * self.debuffs.getBaseDamageReductionPct() * self.debuffs.itemBuffs.getBaseDamageReductionPct() * abilityBaseDamage.multiplier)];
    });
    self.baseDamageAvg = ko.pureComputed(function () {
        return (self.baseDamage()[0] + self.baseDamage()[1]) / 2;
    });
    self.baseDamageMin = ko.pureComputed(function () {
        return self.baseDamage()[0];
    });
    self.baseDamageMax = ko.pureComputed(function () {
        return self.baseDamage()[1];
    });
    self.bonusDamage = ko.pureComputed(function () {
        return ((self.inventory.getBonusDamage().total
                + self.ability().getBonusDamage().total
                + self.buffs.getBonusDamage().total
                + Math.floor((self.baseDamage()[0] + self.baseDamage()[1]) / 2 
                              * (self.buffs.itemBuffs.getBonusDamagePercent(self.inventory.getBonusDamagePercent()).total
                                 + self.ability().getBonusDamagePercent().total
                                 + self.buffs.getBonusDamagePercent().total
                                )
                            )
                + Math.floor(
                    (self.heroData().attacktype == 'DOTA_UNIT_CAP_RANGED_ATTACK' 
                        ? ((self.heroId() == 'drow_ranger') ? self.ability().getBonusDamagePrecisionAura().total[0] * self.totalAgi() : self.buffs.getBonusDamagePrecisionAura().total[1])
                        : 0)
                  )
                + Math.floor(
                    ((self.heroId() == 'riki') ? self.ability().getBonusDamageBackstab().total[0] * self.totalAgi() : 0)
                  )
                ) * self.ability().getSelfBaseDamageReductionPct()
                  * self.enemy().ability().getBaseDamageReductionPct()
                  * self.debuffs.itemBuffs.getBaseDamageReductionPct());
    });
    self.bonusDamageReduction = ko.pureComputed(function () {
        return Math.abs(self.enemy().ability().getBonusDamageReduction() + self.debuffs.getBonusDamageReduction());
    });
    self.damageAvg = ko.pureComputed(function () {
        return (self.baseDamage()[0] + self.baseDamage()[1]) / 2 + self.bonusDamage();
    });
    self.damageMin = ko.pureComputed(function () {
        return self.baseDamage()[0] + self.bonusDamage();
    });
    self.damageMax = ko.pureComputed(function () {
        return self.baseDamage()[1] + self.bonusDamage();
    });
    self.damage = ko.pureComputed(function () {
        return [self.baseDamage()[0] + self.bonusDamage(),
                self.baseDamage()[1] + self.bonusDamage()];
    });
    self.totalMagicResistanceProduct = ko.pureComputed(function () {
        return (1 - self.heroData().magicalresistance / 100) 
                * self.inventory.getMagicResist()
                * self.ability().getMagicResist()
                * self.buffs.getMagicResist()
                * self.inventory.getMagicResistReductionSelf()
                * self.enemy().inventory.getMagicResistReduction()
                * self.enemy().ability().getMagicResistReduction()
                * self.debuffs.getMagicResistReduction()
                * self.debuffs.itemBuffs.getMagicResistReduction();
    });
    self.totalMagicResistance = ko.pureComputed(function () {
        return ((1 - self.totalMagicResistanceProduct()) * 100).toFixed(2);
    });
    self.bat = ko.pureComputed(function () {
        var abilityBAT = self.ability().getBAT();
        if (abilityBAT > 0) {
            return abilityBAT;
        }
        return self.heroData().attackrate;
    });
    self.ias = ko.pureComputed(function () {
        var attackSpeed = [self.inventory.getAttackSpeed, self.buffs.itemBuffs.getAttackSpeed].reduce(function (memo, fn) {
            var obj = fn(memo.excludeList);
            obj.value += memo.value;
            return obj;
        }, {value:0, excludeList:[]});
        var attackSpeedReduction = [self.enemy().inventory.getAttackSpeedReduction, self.debuffs.itemBuffs.getAttackSpeedReduction].reduce(function (memo, fn) {
            var obj = fn(memo.excludeList);
            obj.value += memo.value;
            return obj;
        }, {value:0, excludeList: []});
        var val = parseFloat(self.totalAgi()) 
                //+ self.inventory.getAttackSpeed() 
                + attackSpeed.value
                + attackSpeedReduction.value
                //+ self.enemy().inventory.getAttackSpeedReduction() 
                + self.ability().getAttackSpeed() 
                + self.enemy().ability().getAttackSpeedReduction() 
                + self.buffs.getAttackSpeed() 
                + self.debuffs.getAttackSpeedReduction()
                + self.unit().ability().getAttackSpeed(); 
        if (val < -80) {
            return -80;
        }
        else if (val > 500) {
            return 500;
        }
        return val.toFixed(2);
    });
    self.attackTime = ko.pureComputed(function () {
        return (self.bat() / (1 + self.ias() / 100)).toFixed(2);
    });
    self.attacksPerSecond = ko.pureComputed(function () {
        return ((1 + self.ias() / 100) / self.bat()).toFixed(2);
    });
    self.evasion = ko.pureComputed(function () {
        if (self.enemy().inventory.isSheeped() || self.debuffs.itemBuffs.isSheeped()) return 0;
        var e = self.ability().setEvasion();
        if (e) {
            return (e * 100).toFixed(2);
        }
        else {
            return ((1-(self.inventory.getEvasion() * self.ability().getEvasion() * self.ability().getEvasionBacktrack() * self.buffs.itemBuffs.getEvasion())) * 100).toFixed(2);
        }
    });
    self.ehpPhysical = ko.pureComputed(function () {
        var evasion = self.enemy().inventory.isSheeped() || self.debuffs.itemBuffs.isSheeped() ? 1 : self.inventory.getEvasion() * self.ability().getEvasion() * self.buffs.itemBuffs.getEvasion();
        if (self.totalArmorPhysical() >= 0) {
            var ehp = self.health() * (1 + .06 * self.totalArmorPhysical());
        }
        else {
            var ehp = self.health() * (1 - .06 * self.totalArmorPhysical()) / (1 - .12 * self.totalArmorPhysical());
        }
        ehp /= (1 - (1 - (evasion * self.ability().getEvasionBacktrack())));
        ehp /= (1 - parseFloat(self.enemy().missChance()) / 100);
        ehp *= (self.inventory.activeItems().some(function (item) {return item.item == 'mask_of_madness';}) ? (1 / 1.3) : 1);
        ehp *= (1 / self.ability().getDamageReduction());
        ehp *= (1 / self.buffs.getDamageReduction());
        ehp *= (1 / self.enemy().ability().getDamageAmplification());
        ehp *= (1 / self.debuffs.getDamageAmplification());
        return ehp.toFixed(2);
    });
    self.ehpMagical = ko.pureComputed(function () {
        var ehp = self.health() / self.totalMagicResistanceProduct();
        ehp *= (self.inventory.activeItems().some(function (item) {return item.item == 'mask_of_madness';}) ? (1 / 1.3) : 1);
        ehp *= (1 / self.ability().getDamageReduction());
        ehp *= (1 / self.buffs.getDamageReduction());
        ehp *= (1 / self.ability().getEvasionBacktrack());
        ehp *= (1 / self.enemy().ability().getDamageAmplification());
        ehp *= (1 / self.debuffs.getDamageAmplification());
        return ehp.toFixed(2);
    });
    self.bash = ko.pureComputed(function () {
        var attacktype = self.heroData().attacktype;
        return ((1 - (self.inventory.getBash(attacktype) * self.ability().getBash())) * 100).toFixed(2);
    });
    
    self.critChance = ko.pureComputed(function () {
        return ((1 - (self.inventory.getCritChance() * self.ability().getCritChance())) * 100).toFixed(2);
    });

    HeroDamageMixin(self, itemData);
    
    /*self.critDamage = ko.computed(function () {
        self.critInfo();
        return 0;
    });*/
    self.missChance = ko.pureComputed(function () {
        var missDebuff = [self.enemy().inventory.getMissChance, self.debuffs.itemBuffs.getMissChance].reduce(function (memo, fn) {
            var obj = fn(memo.excludeList);
            obj.value *= memo.value;
            return obj;
        }, {value:1, excludeList:[]});
        return ((1 - (self.enemy().ability().getMissChance() * self.debuffs.getMissChance() * missDebuff.value)) * 100).toFixed(2);
    });
    self.totalattackrange = ko.pureComputed(function () {
        var attacktype = self.heroData().attacktype;
        return self.heroData().attackrange + self.ability().getAttackRange() + self.inventory.getAttackRange(attacktype).value;
    });
    self.visionrangeday = ko.pureComputed(function () {
        return (self.heroData().visiondaytimerange) * (1 + self.enemy().ability().getVisionRangePctReduction() + self.debuffs.getVisionRangePctReduction());
    });
    self.visionrangenight = ko.pureComputed(function () {
        return (self.heroData().visionnighttimerange + self.inventory.getVisionRangeNight() + self.ability().getVisionRangeNight()) * (1 + self.enemy().ability().getVisionRangePctReduction() + self.debuffs.getVisionRangePctReduction());
    });
    self.lifesteal = ko.pureComputed(function () {
        var total = self.inventory.getLifesteal() + self.ability().getLifesteal() + self.buffs.getLifesteal();
        if (self.heroData().attacktype == 'DOTA_UNIT_CAP_MELEE_ATTACK') {
            var lifestealAura = [self.inventory.getLifestealAura, self.buffs.itemBuffs.getLifestealAura].reduce(function (memo, fn) {
                var obj = fn(memo.excludeList);
                obj.value += memo.value;
                return obj;
            }, {value: 0, excludeList: []});
            total += lifestealAura.value;
        }
        return (total).toFixed(2);
    });
    
    self.diffProperties = diffProperties;
    self.diff = {};

    for (var i = 0; i < self.diffProperties.length; i++) {
        var index = i;
        self.diff[self.diffProperties[index]] = self.getDiffFunction(self.diffProperties[index]);
    }
};

HeroModel.prototype.getDiffFunction = function (prop) {
    var self = this;
    return ko.computed(function () {
        if (prop == 'baseDamage') {
            return [self[prop]()[0] - self.heroCompare()[prop]()[0], self[prop]()[1] - self.heroCompare()[prop]()[1]];
        }
        else {
            return self[prop]() - self.heroCompare()[prop]();
        }
    }, this, { deferEvaluation: true });
}

HeroModel.prototype.getAbilityLevelMax = function (data) {
    if (data.abilitytype === 'DOTA_ABILITY_TYPE_ATTRIBUTES') {
        return 10;
    }
    else if (data.name === 'invoker_quas' || data.name === 'invoker_wex' || data.name === 'invoker_exort') {
        return 7;
    }
    else if (data.name === 'invoker_invoke') {
        return 4;
    }
    else if (data.name === 'earth_spirit_stone_caller' || data.name === 'ogre_magi_unrefined_fireblast') {
        return 1;
    }
    else if (data.abilitytype === 'DOTA_ABILITY_TYPE_ULTIMATE' || data.name === 'keeper_of_the_light_recall' ||
             data.name === 'keeper_of_the_light_blinding_light' || data.name === 'ember_spirit_activate_fire_remnant' ||
             data.name === 'lone_druid_true_form_battle_cry') {
        return 3;
    }
    else if (data.name === 'puck_ethereal_jaunt'  || data.name === 'shadow_demon_shadow_poison_release' ||
             data.name === 'templar_assassin_trap' || data.name === 'spectre_reality') {
        return 0;
    }
    else if (data.name === 'invoker_cold_snap'  || data.name === 'invoker_ghost_walk' || data.name === 'invoker_tornado' || 
             data.name === 'invoker_emp' || data.name === 'invoker_alacrity' || data.name === 'invoker_chaos_meteor' || 
             data.name === 'invoker_sun_strike' || data.name === 'invoker_forge_spirit' || data.name === 'invoker_ice_wall' || 
             data.name === 'invoker_deafening_blast') {
        return 0;
    }
    else if (data.name === 'techies_minefield_sign' || data.name === 'techies_focused_detonate') {
        return 0;
    }
    else {
        return 4;
    }
};

module.exports = HeroModel;
},{"../AbilityModel":1,"../BuffViewModel":2,"../herocalc_knockout":19,"../inventory/InventoryViewModel":22,"./HeroDamageMixin":9,"./diffProperties":14,"./nextLevelExp":16,"./totalExp":17}],11:[function(require,module,exports){
var HeroOption = function (name, displayname, hero) {
    this.heroName = name;
    this.heroDisplayName = displayname;
    this.hero = hero;
};

module.exports = HeroOption;
},{}],12:[function(require,module,exports){
'use strict';
var HeroModel = require("./HeroModel");
var illusionData = require("../illusion/illusionData");
var findWhere = require("../util/findWhere");

var IllusionModel = function (heroData, itemData, h,p, abilityLevel) {
    var self = this;
    HeroModel.call(this, heroData, itemData, h);
    self.illusionAbilityLevel = ko.observable(abilityLevel);
    self.parent = p;
    
    self.totalAgi = ko.computed(function () {
        return (self.heroData().attributebaseagility
                + self.heroData().attributeagilitygain * (self.selectedHeroLevel() - 1) 
                + self.inventory.getAttributes('agi') 
                + self.ability().getAttributeBonusLevel() * 2
                + self.ability().getAgility()
                + self.enemy().ability().getAllStatsReduction()
                + self.debuffs.getAllStatsReduction()
               ).toFixed(2);
    });
    self.intStolen = ko.observable(0).extend({ numeric: 0 });
    self.totalInt = ko.computed(function () {
        return (self.heroData().attributebaseintelligence 
                + self.heroData().attributeintelligencegain * (self.selectedHeroLevel() - 1) 
                + self.inventory.getAttributes('int') 
                + self.ability().getAttributeBonusLevel() * 2
                + self.ability().getIntelligence()
                + self.enemy().ability().getAllStatsReduction()
                + self.debuffs.getAllStatsReduction() + self.intStolen()
               ).toFixed(2);
    });
    self.totalStr = ko.computed(function () {
        return (self.heroData().attributebasestrength 
                + self.heroData().attributestrengthgain * (self.selectedHeroLevel() - 1) 
                + self.inventory.getAttributes('str') 
                + self.ability().getAttributeBonusLevel() * 2
                + self.ability().getStrength()
                + self.enemy().ability().getAllStatsReduction()
                + self.debuffs.getAllStatsReduction()
               ).toFixed(2);
    });
    
    self.getAbilityAttributeValue = function(hero, ability, attributeName, level) {
        if (ability == 'item_manta') {
            var abilityObj = itemData[ability];
        }
        else {
            var abilityObj = findWhere(heroData['npc_dota_hero_' + hero].abilities, {name: ability});
        }
        var attribute = findWhere(abilityObj.attributes, {name: attributeName});
        if (level == 0) {
            return parseFloat(attribute.value[0]);
        }
        else if (level > attribute.length) {
            return parseFloat(attribute.value[0]);
        }
        else {
            return parseFloat(attribute.value[level - 1]);
        }
    }
    
    self.getIncomingDamageMultiplier = function(illusionType, hasScepter, attackType) {
        if (illusionType == 'item_manta') {
            if (attackType == 'DOTA_UNIT_CAP_MELEE_ATTACK') {
                return (1 + self.getAbilityAttributeValue(illusionData[self.illusionType()].hero, self.illusionType(), illusionData[illusionType].incoming_damage_melee, self.illusionAbilityLevel())/100)
            }
            else {
                return (1 + self.getAbilityAttributeValue(illusionData[self.illusionType()].hero, self.illusionType(), illusionData[illusionType].incoming_damage_ranged, self.illusionAbilityLevel())/100)
            }
        }
        else {
            return (1 + self.getAbilityAttributeValue(illusionData[self.illusionType()].hero, self.illusionType(), illusionData[illusionType].incoming_damage, self.illusionAbilityLevel())/100)
        }
    }
    self.getOutgoingDamageMultiplier = function(illusionType, hasScepter, attackType) {
        if (illusionType == 'item_manta') {
            if (attackType == 'DOTA_UNIT_CAP_MELEE_ATTACK') {
                return (1 + self.getAbilityAttributeValue(illusionData[self.illusionType()].hero, self.illusionType(), illusionData[illusionType].outgoing_damage_melee, self.illusionAbilityLevel())/100);
            }
            else {
                return (1 + self.getAbilityAttributeValue(illusionData[self.illusionType()].hero, self.illusionType(), illusionData[illusionType].outgoing_damage_ranged, self.illusionAbilityLevel())/100);
            }
        }
        else {
            return (1 + self.getAbilityAttributeValue(illusionData[self.illusionType()].hero, self.illusionType(), illusionData[illusionType].outgoing_damage, self.illusionAbilityLevel())/100);
        }
    }

    self.baseDamage = ko.computed(function() {
        return [Math.floor(heroData['npc_dota_hero_' + self.heroId()].attackdamagemin + self.totalAttribute(self.primaryAttribute()) + self.ability().getBaseDamage().total)
                * self.getOutgoingDamageMultiplier(self.illusionType(), false, self.heroData().attacktype),
                Math.floor(heroData['npc_dota_hero_' + self.heroId()].attackdamagemax + self.totalAttribute(self.primaryAttribute()) + self.ability().getBaseDamage().total)
                * self.getOutgoingDamageMultiplier(self.illusionType(), false, self.heroData().attacktype)];
    });
    
    self.damage = ko.computed(function() {
        return [self.baseDamage()[0],
                self.baseDamage()[1]];
    });
    
    self.ehpPhysical = ko.computed(function() {
        var ehp = (self.health() * (1 + .06 * self.totalArmorPhysical())) / (1 - (1 - (self.inventory.getEvasion() * self.ability().getEvasion())))
        ehp *= (self.inventory.activeItems().some(function(item) {return item.item == 'mask_of_madness';}) ? (1 / 1.3) : 1);
        ehp *= (1 / self.getIncomingDamageMultiplier(self.illusionType(), false, self.heroData().attacktype));
        return ehp.toFixed(2);
    });
    self.ehpMagical = ko.computed(function() {
        var ehp = self.health() / self.totalMagicResistanceProduct();
        ehp *= (1 / self.getIncomingDamageMultiplier(self.illusionType(), false, self.heroData().attacktype));
        return ehp.toFixed(2);
    });
    
    self.totalArmorPhysical = ko.computed(function() {
        return (self.enemy().ability().getArmorBaseReduction() * self.debuffs.getArmorBaseReduction() * (heroData['npc_dota_hero_' + self.heroId()].armorphysical + self.totalAgi() * .14)
                + self.ability().getArmor() + self.enemy().ability().getArmorReduction() + self.buffs.getArmor() + self.debuffs.getArmorReduction()).toFixed(2);
    });
    
    self.ias = ko.computed(function() {
        var val = parseFloat(self.totalAgi()) 
                + self.ability().getAttackSpeed() 
                + self.enemy().ability().getAttackSpeedReduction() 
                + self.buffs.getAttackSpeed() 
                + self.debuffs.getAttackSpeedReduction()
                + self.unit().ability().getAttackSpeed(); 
        if (val < -80) {
            return -80;
        }
        else if (val > 400) {
            return 400;
        }
        return val.toFixed(2);
    });
    
    return self;
}
IllusionModel.prototype = Object.create(HeroModel.prototype);
IllusionModel.prototype.constructor = IllusionModel;

module.exports = IllusionModel;
},{"../illusion/illusionData":20,"../util/findWhere":33,"./HeroModel":10}],13:[function(require,module,exports){
'use strict';
var ko = require('../herocalc_knockout');

var AbilityModel = require("../AbilityModel");
var HeroModel = require("./HeroModel");
var unitData = require("../data/main").unitData;

var UnitModel = function (heroData, itemData, h, p) {
    var self = this;
    HeroModel.call(this, heroData, itemData, 'abaddon');
    self.parent = p;
    self.unitId = ko.observable(h);
    self.unitLevel = ko.observable(1);

    self.heroData = ko.computed(function() {
        return unitData[self.unitId()];
    });
    self.getAbilityLevelMax = function(data) {
        if (data.abilitytype == 'DOTA_ABILITY_TYPE_ATTRIBUTES') {
            return 10;
        }
        else if (data.name == 'necronomicon_archer_mana_burn' || data.name == 'necronomicon_archer_aoe'
            || data.name == 'necronomicon_warrior_mana_burn' || data.name == 'necronomicon_warrior_last_will') {
            return 3;
        }
        else if (data.name == 'necronomicon_warrior_sight') {
            return 1;
        }
        else {
            return 4;
        }
    };
    self.availableSkillPoints.dispose();
    self.ability = ko.computed(function() {
        var a = new AbilityModel(ko.observableArray(JSON.parse(JSON.stringify(self.heroData().abilities))), self);
        a.hasScepter = self.inventory.hasScepter
        switch (self.unitId()) {
            case 'npc_dota_necronomicon_archer_1':
            case 'npc_dota_necronomicon_warrior_1':
                a.abilities()[0].level(1);
                a.abilities()[1].level(1);
            break;
            case 'npc_dota_necronomicon_archer_2':
            case 'npc_dota_necronomicon_warrior_2':
                a.abilities()[0].level(2);
                a.abilities()[1].level(2);
            break;
            case 'npc_dota_necronomicon_archer_3':
                a.abilities()[0].level(3);
                a.abilities()[1].level(3);
            break;
            case 'npc_dota_necronomicon_warrior_3':
                a.abilities()[0].level(3);
                a.abilities()[1].level(3);
                a.abilities()[2].level(1);
            break;
        }
        a.levelUpAbility = function(index, data, event, hero) {
            var i = ko.utils.unwrapObservable(index);
            switch (a.abilities()[i].name) {
                case 'necronomicon_archer_mana_burn':
                case 'necronomicon_archer_aoe':
                case 'necronomicon_warrior_mana_burn':
                case 'necronomicon_warrior_last_will':
                case 'necronomicon_warrior_sight':
                break;
                default:
                    if (a.abilities()[i].level() < hero.getAbilityLevelMax(data)) {
                        a.abilities()[i].level(a.abilities()[i].level()+1);
                    }                    
                break;
            }

        };
        a.levelDownAbility = function(index, data, event, hero) {            
            var i = ko.utils.unwrapObservable(index);
            switch (a.abilities()[i].name) {
                case 'necronomicon_archer_mana_burn':
                case 'necronomicon_archer_aoe':
                case 'necronomicon_warrior_mana_burn':
                case 'necronomicon_warrior_last_will':
                case 'necronomicon_warrior_sight':
                break;
                default:
                    if (a.abilities()[i].level()>0) {
                        a.abilities()[i].level(a.abilities()[i].level()-1);
                    }
                break;
            }
        };
        return a;
    });        
    self.primaryAttribute = ko.computed(function() {
        //var v = unitData[self.unitId()].attributeprimary;
        var v = 0;
        if (v == 'DOTA_ATTRIBUTE_AGILITY') {
            return 'agi'
        }
        else if (v == 'DOTA_ATTRIBUTE_INTELLECT') {
            return 'int'
        }
        else if (v == 'DOTA_ATTRIBUTE_STRENGTH') {
            return 'str'
        }
        else {
            return ''
        }
    });
    self.totalAttribute = function(a) {
        if (a == 'agi') {
            return parseFloat(self.totalAgi());
        }
        if (a == 'int') {
            return parseFloat(self.totalInt());
        }
        if (a == 'str') {
            return parseFloat(self.totalStr());
        }
        return 0;
    };
    self.totalAgi = ko.computed(function() {
        return (unitData[self.unitId()].attributebaseagility
                + unitData[self.unitId()].attributeagilitygain * (self.selectedHeroLevel() - 1) 
                //+ self.inventory.getAttributes('agi') 
                + self.ability().getAttributeBonusLevel()*2
                + self.ability().getAgility()
                + self.enemy().ability().getAllStatsReduction()
                + self.debuffs.getAllStatsReduction()
               ).toFixed(2);
    });
    self.totalInt = ko.computed(function() {
        return (unitData[self.unitId()].attributebaseintelligence 
                + unitData[self.unitId()].attributeintelligencegain * (self.selectedHeroLevel() - 1) 
                //+ self.inventory.getAttributes('int') 
                + self.ability().getAttributeBonusLevel()*2
                + self.ability().getIntelligence()
                + self.enemy().ability().getAllStatsReduction()
                + self.debuffs.getAllStatsReduction()
               ).toFixed(2);
    });
    self.totalStr = ko.computed(function() {
        return (unitData[self.unitId()].attributebasestrength 
                + unitData[self.unitId()].attributestrengthgain * (self.selectedHeroLevel() - 1) 
                //+ self.inventory.getAttributes('str') 
                + self.ability().getAttributeBonusLevel()*2
                + self.ability().getStrength()
                + self.enemy().ability().getAllStatsReduction()
                + self.debuffs.getAllStatsReduction()
               ).toFixed(2);
    });
    /*self.health = ko.computed(function() {
        return (unitData[self.unitId()].statushealth + self.totalStr()*19 
                + self.inventory.getHealth()
                + self.ability().getHealth()).toFixed(2);
    });
    self.healthregen = ko.computed(function() {
        return (unitData[self.unitId()].statushealthregen + self.totalStr()*.03 
                + self.inventory.getHealthRegen() 
                + self.ability().getHealthRegen()
                + self.buffs.getHealthRegen()).toFixed(2);
    });
    self.mana = ko.computed(function() {
        return (unitData[self.unitId()].statusmana + self.totalInt()*13 + self.inventory.getMana()).toFixed(2);
    });
    self.manaregen = ko.computed(function() {
        return ((unitData[self.unitId()].statusmanaregen 
                + self.totalInt()*.04 
                + self.ability().getManaRegen()) 
                * (1 + self.inventory.getManaRegenPercent()) 
                + (self.selectedHero().heroName == 'crystal_maiden' ? self.ability().getManaRegenArcaneAura() * 2 : self.buffs.getManaRegenArcaneAura())
                + self.inventory.getManaRegenBloodstone()
                - self.enemy().ability().getManaRegenReduction()).toFixed(2);
    });
    self.totalArmorPhysical = ko.computed(function() {
        return (self.enemy().ability().getArmorBaseReduction() * self.debuffs.getArmorBaseReduction() * (unitData[self.unitId()].armorphysical + self.totalAgi()*.14)
                + self.inventory.getArmor() + self.ability().getArmor() + self.enemy().ability().getArmorReduction() + self.buffs.getArmor() + self.debuffs.getArmorReduction()).toFixed(2);
    });
    self.totalArmorPhysicalReduction = ko.computed(function() {
        return ((0.06 * self.totalArmorPhysical()) / (1 + 0.06 * self.totalArmorPhysical()) * 100).toFixed(2);
    });
    self.totalMovementSpeed = ko.computed(function() {
        if (self.parent.ability().isShapeShiftActive()) {
            return 522;
        }
        var ms = (self.ability().setMovementSpeed() > 0 ? self.ability().setMovementSpeed() : self.buffs.setMovementSpeed());
        if (ms > 0) {
            return ms;
        }
        else {
            return ((unitData[self.unitId()].movementspeed + self.inventory.getMovementSpeedFlat()+ self.ability().getMovementSpeedFlat()) * 
                    (1 + self.inventory.getMovementSpeedPercent() 
                       + self.ability().getMovementSpeedPercent() 
                       + self.enemy().inventory.getMovementSpeedPercentReduction() 
                       + self.enemy().ability().getMovementSpeedPercentReduction() 
                       + self.buffs.getMovementSpeedPercent() 
                       + self.debuffs.getMovementSpeedPercentReduction()
                    )).toFixed(2);
        }
    });
    self.totalTurnRate = ko.computed(function() {
        return (unitData[self.unitId()].movementturnrate 
                * (1 + self.enemy().ability().getTurnRateReduction()
                     + self.debuffs.getTurnRateReduction())).toFixed(2);
    });
    */
    self.baseDamage = ko.computed(function() {
        return [Math.floor(unitData[self.unitId()].attackdamagemin + self.totalAttribute(self.primaryAttribute()) + self.ability().getBaseDamage().total),
                Math.floor(unitData[self.unitId()].attackdamagemax + self.totalAttribute(self.primaryAttribute()) + self.ability().getBaseDamage().total)];
    });
    /*self.bonusDamage = ko.computed(function() {
        return self.inventory.getBonusDamage().total
                + self.ability().getBonusDamage().total
                + self.buffs.getBonusDamage().total
                + Math.floor((self.baseDamage()[0] + self.baseDamage()[1])/2 
                              * (self.inventory.getBonusDamagePercent().total
                                 + self.ability().getBonusDamagePercent().total
                                 + self.buffs.getBonusDamagePercent().total
                                )
                            )
                + Math.floor(
                    (self.hero().attacktype() == 'DOTA_UNIT_CAP_RANGED_ATTACK' 
                        ? ((self.selectedHero().heroName == 'drow_ranger') ? self.ability().getBonusDamagePrecisionAura().total[0] * self.totalAgi() : self.buffs.getBonusDamagePrecisionAura().total[1])
                        : 0)
                  );
    });*/
    /*self.bonusDamageReduction = ko.computed(function() {
        return Math.abs(self.enemy().ability().getBonusDamageReduction() + self.debuffs.getBonusDamageReduction());
    });
    self.damage = ko.computed(function() {
        return [self.baseDamage()[0] + self.bonusDamage()[0],
                self.baseDamage()[1] + self.bonusDamage()[1]];
    });*/
    self.totalMagicResistanceProduct = ko.computed(function() {
        return (1 - unitData[self.unitId()].magicalresistance / 100) 
                   * (1 - self.inventory.getMagicResist() / 100) 
                   * (1 - self.ability().getMagicResist() / 100) 
                   * (1 - self.buffs.getMagicResist() / 100) 
                   * self.enemy().inventory.getMagicResistReduction()
                   * self.enemy().ability().getMagicResistReduction() 
                   * self.debuffs.getMagicResistReduction();
    });
    self.totalMagicResistance = ko.computed(function() {
        return (1 - self.totalMagicResistanceProduct());
    });
    self.bat = ko.computed(function() {
        var abilityBAT = self.ability().getBAT();
        if (abilityBAT > 0) {
            return abilityBAT;
        }
        return unitData[self.unitId()].attackrate;
    });
    /*
    self.ias = ko.computed(function() {
        var val = parseFloat(self.totalAgi()) 
                + self.inventory.getAttackSpeed() 
                + self.ability().getAttackSpeed() 
                + self.enemy().ability().getAttackSpeedReduction() 
                + self.buffs.getAttackSpeed() 
                + self.debuffs.getAttackSpeedReduction();
        if (val < -80) {
            return -80;
        }
        else if (val > 400) {
            return 400;
        }
        return (val).toFixed(2);
    });*/
    self.attackTime = ko.computed(function() {
        return (self.bat() / (1 + self.ias() / 100)).toFixed(2);
    });
    self.attacksPerSecond = ko.computed(function() {
        return (1 + self.ias() / 100) / self.bat();
    });
    self.evasion = ko.computed(function() {
        var e = self.ability().setEvasion();
        if (e) {
            return (e * 100).toFixed(2) + '%';
        }
        else {
            return ((1-(self.inventory.getEvasion() * self.ability().getEvasion())) * 100).toFixed(2) + '%';
        }
    });
    self.ehpPhysical = ko.computed(function() {
        return ((self.health() * (1 + .06 * self.totalArmorPhysical())) / (1-(1-(self.inventory.getEvasion() * self.ability().getEvasion())))).toFixed(2);
    });
    self.ehpMagical = ko.computed(function() {
        return (self.health() / self.totalMagicResistanceProduct()).toFixed(2);
    });
    self.heroId(h);
    self.unitId.subscribe(function (newValue) {
        self.heroId(newValue);
    });
    return self;
}
UnitModel.prototype = Object.create(HeroModel.prototype);
UnitModel.prototype.constructor = UnitModel;

module.exports = UnitModel;
},{"../AbilityModel":1,"../data/main":6,"../herocalc_knockout":19,"./HeroModel":10}],14:[function(require,module,exports){
var diffProperties = [
    'totalAgi',
    'totalInt',
    'totalStr',
    'health',
    'healthregen',
    'mana',
    'manaregen',
    'totalArmorPhysical',
    'totalArmorPhysicalReduction',
    'totalMovementSpeed',
    'totalTurnRate',
    'baseDamage',
    'bonusDamage',
    'bonusDamageReduction',
    'damage',
    'totalMagicResistanceProduct',
    'totalMagicResistance',
    'bat',
    'ias',
    'attackTime',
    'attacksPerSecond',
    'evasion',
    'ehpPhysical',
    'ehpMagical',
    'bash',
    'critChance',
    //'critDamage',
    'missChance',
    'totalattackrange',
    'visionrangeday',
    'visionrangenight',
    'lifesteal'
];

module.exports = diffProperties;
},{}],15:[function(require,module,exports){
var HeroOption = require("./HeroOption");

var heroOptionsArray = {};

var init = function (heroData) {
    heroOptionsArray.items = [];
    for (var h in heroData) {
        heroOptionsArray.items.push(new HeroOption(h.replace('npc_dota_hero_', ''), heroData[h].displayname));
    }
    return heroOptionsArray.items;
}

heroOptionsArray.init = init;

module.exports = heroOptionsArray;
},{"./HeroOption":11}],16:[function(require,module,exports){
var nextLevelExp = [200, 300, 400, 500, 600, 600, 800, 1000, 1000, 600, 2200, 800, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500, '&mdash;'];

module.exports = nextLevelExp;
},{}],17:[function(require,module,exports){
var totalExp = [0, 200, 500, 900, 1400, 2000, 2600, 3400, 4400, 5400, 6000, 8200, 9000, 10400, 11900, 13500, 15200, 17000, 18900, 20900, 23000, 25200, 27500, 29900, 32400];

module.exports = totalExp;
},{}],18:[function(require,module,exports){
var abilityData = {
    'alchemist_acid_spray': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            attributeName: 'armor_reduction',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return -a;
            },
            returnProperty: 'armorReduction'
        }
    ],
    'alchemist_unstable_concoction': [
        {
            label: 'Brew Time',
            controlType: 'input'
        },
        {
            attributeName: 'max_damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a/5;
            }
        },
        {
            attributeName: 'max_stun',
            label: 'Total Stun',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a/5;
            }
        }
    ],
    'ancient_apparition_cold_feet': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            attributeName: 'stun_duration',
            label: 'Total Stun',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            }
        }
    ],
    'ancient_apparition_ice_blast': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'dot_damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')+v*a;
            }
        }
    ],
    'antimage_mana_void': [
        {
            label: 'Enemy Missing Mana',
            controlType: 'input'
        },
        {
            attributeName: 'mana_void_damage_per_mana',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        }
    ],
    'axe_battle_hunger': [
        {
            label: 'Battle Hungered Enemies',
            controlType: 'input'
        },
        {
            attributeName: 'speed_bonus',
            label: 'Movement Speed Bonus',
            controlType: 'text',
            noLevel: true,
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            },
            returnProperty: 'movementSpeedPct'
        },
        {
            attributeName: 'slow',
            label: 'Movement Speed Bonus',
            controlType: 'text',
            noLevel: true,
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
    'bane_nightmare': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            label: 'DAMAGE:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')*v;
            }
        }
    ],
    'bane_fiends_grip': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            label: 'Enemy Max Mana',
            controlType: 'input'
        },
        {
            attributeName: 'fiend_grip_damage',
            label: 'Total Damage',
            controlType: 'text',
            controls: [0,1],
            fn: function (v, a, parent, index, abilityModel, ability) {
                if (parent.inventory.hasScepter()) {
                    return v[0]*abilityModel.getAbilityAttributeValue(ability.attributes, 'fiend_grip_damage_scepter',ability.level());
                }
                else {
                    return v[0]*a;
                }
            }
        },
        {
            attributeName: 'fiend_grip_mana_drain',
            label: 'Total Mana Drain',
            controlType: 'text',
            controls: [0,1],
            noLevel: true,
            fn: function (v, a, parent, index, abilityModel, ability) {
                if (parent.inventory.hasScepter()) {
                    return v[0]*v[1]*abilityModel.getAbilityAttributeValue(ability.attributes, 'fiend_grip_mana_drain_scepter',ability.level())/100;
                }
                else {
                    return v[0]*v[1]*a/100;
                }
            }
        }
    ],
    'batrider_sticky_napalm': [
        {
            label: 'Stacks',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Bonus Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            },
            returnProperty: 'bonusDamage'
        },
        {
            attributeName: 'movement_speed_pct',
            label: 'Enemy Movement Speed Slow',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            },
            returnProperty: 'movementSpeedPctReduction'
        },
        {
            attributeName: 'turn_rate_pct',
            label: 'Enemy Turn Rate Slow',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'turnRateReduction'
        }
    ],
    'batrider_firefly': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage_per_second',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        }
    ],
    'bloodseeker_rupture': [
        {
            label: 'Enemy Distance Traveled',
            controlType: 'input'
        },
        {
            attributeName: 'movement_damage_pct',
            label: 'DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage') + v*a/100;
            }
        }
    ],
    'bristleback_viscous_nasal_goo': [
        {
            label: 'Stacks',
            controlType: 'input'
        },
        {
            attributeName: 'armor_per_stack',
            label: 'Enemy Armor Reduction',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return -v*a;
            },
            returnProperty: 'armorReduction'
        },
        {
            attributeName: 'move_slow_per_stack',
            label: '%SLOW:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return -(abilityModel.getAbilityAttributeValue(ability.attributes, 'base_move_slow',0)+v*a);
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
    'bristleback_quill_spray': [
        {
            label: 'Stacks',
            controlType: 'input'
        },
        {
            attributeName: 'quill_stack_damage',
            label: 'DAMAGE',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var total = abilityModel.getAbilityAttributeValue(ability.attributes, 'quill_base_damage',ability.level())+v*a,
                damage_cap = abilityModel.getAbilityAttributeValue(ability.attributes, 'max_damage',0);
                if (total > damage_cap) {
                    total = damage_cap;
                }
                return total;
            }
        }
    ],
    'bristleback_bristleback': [
        {
            label: 'Damage From',
            controlType: 'radio',
            controlValueType: 'string',
            controlOptions: [
                {text: 'Back', value: 'back'},
                {text: 'Side', value: 'side'}
            ]
        },
        {
            attributeName: 'back_damage_reduction',
            label: '%DAMAGE REDUCTION:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var ability = abilityModel.abilities().find(function(b) {
                    return b.name == 'bristleback_bristleback';
                });
                if (v == 'back') {
                    var total = abilityModel.getAbilityAttributeValue(ability.attributes, 'back_damage_reduction', ability.level());
                }
                else {
                    var total = abilityModel.getAbilityAttributeValue(ability.attributes, 'side_damage_reduction', ability.level());
                }
                return -total;
            },
            returnProperty: 'damageReduction'
        }
    ],
    'bristleback_warpath': [
        {
            label: 'Stacks',
            controlType: 'input'
        },
        {
            attributeName: 'damage_per_stack',
            label: 'BONUS DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                if (v < 1) {
                    return 0;
                }
                else {
                    return abilityModel.getAbilityAttributeValue(ability.attributes, 'base_damage',ability.level())+(v-1)*a;
                }
            }
        },
        {
            attributeName: 'move_speed_per_stack',
            label: '%MOVEMENT:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                if (v < 1) {
                    return 0;
                }
                else {
                    return abilityModel.getAbilityAttributeValue(ability.attributes, 'base_move_speed',ability.level())+(v-1)*a;
                }
            },
            returnProperty: 'movementSpeedPct'
        }
    ],
    'centaur_return': [
        {
            label: 'Strength',
            controlType: 'input'
        },
        {
            attributeName: 'strength_pct',
            label: 'DAMAGE:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return abilityModel.getAbilityAttributeValue(ability.attributes, 'return_damage',ability.level()) + v*a/100;
            }
        }
    ],
    'centaur_stampede': [
        {
            label: 'Strength',
            controlType: 'input'
        },
        {
            attributeName: 'strength_damage',
            label: 'DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            attributeName: 'slow_movement_speed',
            label: 'Enemy Movement Speed Slow',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return -a;
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
    'clinkz_death_pact': [
        {
            label: 'Consumed Unit HP',
            controlType: 'input'
        },
        {
            attributeName: 'damage_gain_pct',
            label: 'BASE DAMAGE GAIN:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a/100;
            },
            returnProperty: 'baseDamage'
        },
        {
            attributeName: 'health_gain_pct',
            label: 'HEALTH GAIN:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a/100;
            },
            returnProperty: 'bonusHealth'
        }
    ],
    'crystal_maiden_frostbite': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            label: 'DAMAGE:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')*v;
            }
        }
    ],
    'dark_seer_ion_shell': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage_per_second',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        }
    ],
    'dazzle_shadow_wave': [
        {
            label: 'Targets',
            controlType: 'input'
        },
        {
            label: 'DAMAGE:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')*v;
            }
        }
    ],
    'dazzle_weave': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'armor_per_second',
            label: 'ARMOR',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            },
            returnProperty: 'armor'
        },
        {
            attributeName: 'armor_per_second',
            label: 'ARMOR REDUCTION:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return -v*a;
            },
            returnProperty: 'armorReduction'
        }
    ],
    'death_prophet_exorcism': [
        {
            label: 'Damage Dealt',
            controlType: 'input'
        },
        {
            attributeName: 'heal_percent',
            label: 'Total Armor',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a/100;
            }
        }
    ],
    'disruptor_static_storm': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            label: 'DAMAGE:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var damagevalue = 0.25 * (130 + 40 * ability.level()) * (1/20),
                mult = (v*4)*((v*4)+1)/2;
                return damagevalue * mult;
            }
        }
    ],
    'doom_bringer_scorched_earth': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage_per_second',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            attributeName: 'bonus_movement_speed_pct',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'movementSpeedPct'
        },
        {
            attributeName: 'damage_per_second',
            label: 'HP REGEN:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'healthregen'
        }
    ],
    'doom_bringer_doom': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                if (parent.inventory.hasScepter()) {
                    return v*abilityModel.getAbilityAttributeValue(ability.attributes, 'damage_scepter',ability.level());
                }
                else {
                    return v*a;
                }
            }
        }
    ],
    'dragon_knight_elder_dragon_form': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'bonus_attack_range',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'attackrange'
        },
        {
            attributeName: 'bonus_movement_speed',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'movementSpeedFlat'
        }
    ],
    'drow_ranger_trueshot': [
        {
            label: 'Drow\'s Agility',
            controlType: 'input',
            display: 'buff'
        },
        {
            attributeName: 'trueshot_ranged_damage',
            label: 'DAMAGE BONUS:',
            ignoreTooltip: true,
            controlType: 'text',
            display: 'buff',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a/100;
            },
            returnProperty: 'bonusDamagePrecisionAura'
        }
    ],
    'earth_spirit_rolling_boulder': [
        {
            label: 'Using Stone',
            controlType: 'checkbox'
        },
        {
            attributeName: 'move_slow',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                if (v) {
                    return -a;
                }
                else {
                    return 0;
                }
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
    'earthshaker_enchant_totem': [
        {
            label: 'Activated',
            controlType: 'checkbox'
        },
        {
            attributeName: 'totem_damage_percentage',
            label: 'DAMAGE',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                if (v) {
                    return a;
                }
                else {
                    return 0;
                }
            },
            returnProperty: 'baseDamageMultiplier'
        }
    ],
    'earthshaker_echo_slam': [
        {
            label: 'Enemies in Range',
            controlType: 'input'
        },
        {
            attributeName: 'echo_slam_echo_damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        }
    ],
    'elder_titan_ancestral_spirit': [
        {
            label: 'HEROES PASSED THROUGH',
            controlType: 'input'
        },
        {
            label: 'CREEPS PASSED THROUGH',
            controlType: 'input'
        },
        {
            attributeName: 'damage_creeps',
            label: 'DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            controls: [0,1],
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v[0]*abilityModel.getAbilityAttributeValue(ability.attributes, 'damage_heroes',ability.level()) + v[1]*a;
            },
            returnProperty: 'bonusDamage'
        },
        {
            attributeName: 'move_pct_creeps',
            label: '%BONUS SPEED:',
            ignoreTooltip: true,
            controlType: 'text',
            controls: [0,1],
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v[0]*abilityModel.getAbilityAttributeValue(ability.attributes, 'move_pct_heroes',ability.level()) + v[1]*a;
            },
            returnProperty: 'movementSpeedPct'
        }
    ],
    'elder_titan_earth_splitter': [
        {
            label: 'Enemy Max Health',
            controlType: 'input'
        },
        {
            attributeName: 'damage_pct',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a/100;
            }
        },
        {
            attributeName: 'slow_pct',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return -a;
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
    'enchantress_natures_attendants': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'heal',
            label: 'HEAL:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return abilityModel.getAbilityAttributeValue(ability.attributes, 'wisp_count',ability.level())*v*a;
            }
        }
    ],
    'enigma_malefice': [
        {
            label: 'Hits',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            attributeName: 'stun_duration',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        }
    ],
    'enigma_midnight_pulse': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            label: 'Enemy Max Health',
            controlType: 'input'
        },
        {
            attributeName: 'damage_percent',
            label: 'DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            controls: [0,1],
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v[0]*v[1]*a/100;
            }
        }
    ],
    'enigma_black_hole': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'far_damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            attributeName: 'near_damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        }
    ],
    'faceless_void_time_lock': [
        {
            label: 'In Chronosphere',
            controlType: 'checkbox'
        },
        {
            attributeName: 'bonus_damage',
            label: '%MOVESPEED AS DAMAGE',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                if (v) {
                    return a*2;
                }
                else {
                    return a;
                }
            },
            returnProperty: 'bashBonusDamage'
        },
        {
            attributeName: 'duration',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            }
        },
        {
            attributeName: 'chance_pct',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'bash'
        }
    ],
    'gyrocopter_rocket_barrage': [
        {
            label: 'Rockets',
            controlType: 'input'
        },
        {
            attributeName: 'rockets_per_second',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            }
        },
        {
            label: 'DAMAGE:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')*v;
            }
        }
    ],
/*        'gyrocopter_homing_missile': [
        {
            label: 'Distance Traveled',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        }
    ],
    'gyrocopter_flak_cannon': [
        {
            label: 'Attacks',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        }
    ],*/
    'huskar_burning_spear': [
        {
            label: 'Stacks',
            controlType: 'input'
        },
        {
            attributeName: 'health_cost',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            label: 'DAMAGE:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')*v;
            }
        }
    ],
    'huskar_berserkers_blood': [
        {
            label: '%HP',
            controlType: 'input'
        },
        {
            attributeName: 'hp_threshold_max',
            label: 'Health at given %HP:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return parent.health()*v/100;
            }
        },
        {
            attributeName: 'hp_threshold_max',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            }
        },
        {
            attributeName: 'maximum_resistance',
            label: 'MAGIC RESISTANCE BONUS:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var v = Math.min(v, 100);
                v = Math.max(v, 10);
                var hp_threshold_max = abilityModel.getAbilityAttributeValue(ability.attributes, 'hp_threshold_max',0);
                var d = 100 - hp_threshold_max;
                var c = (v - hp_threshold_max) / d;
                c = 1 - c;
                return c*a;
            },
            returnProperty: 'magicResist'
        },
        {
            attributeName: 'maximum_attack_speed',
            label: 'ATTACK SPEED BONUS:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var v = Math.min(v, 100);
                v = Math.max(v, 10);
                var hp_threshold_max = abilityModel.getAbilityAttributeValue(ability.attributes, 'hp_threshold_max',0);
                var d = 100 - hp_threshold_max;
                var c = (v - hp_threshold_max) / d;
                c = 1 - c;
                return c*a;
            },
            returnProperty: 'attackspeed'
        }
    ],
    'huskar_life_break': [
        {
            label: 'Enemy Current HP',
            controlType: 'input'
        },
        {
            attributeName: 'health_damage',
            label: 'DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            label: 'Huskar Current HP',
            controlType: 'input'
        },
        {
            attributeName: 'health_cost_percent',
            label: 'DAMAGE TAKEN:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            attributeName: 'movespeed',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
    'invoker_quas': [
        {
            label: 'Instances',
            controlType: 'input'
        },
        {
            attributeName: 'bonus_strength',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'bonusStrength'
        },
        {
            attributeName: 'health_regen_per_instance',
            label: 'HP REGEN:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            },
            returnProperty: 'healthregen'
        }
    ],
    'invoker_wex': [
        {
            label: 'Instances',
            controlType: 'input'
        },
        {
            attributeName: 'bonus_agility',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'bonusAgility'
        },
        {
            attributeName: 'move_speed_per_instance',
            label: '%MOVE SPEED:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            },
            returnProperty: 'movementSpeedPct'
        },
        {
            attributeName: 'attack_speed_per_instance',
            label: '%ATTACK SPEED:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            },
            returnProperty: 'attackspeed'
        }
    ],
    'invoker_exort': [
        {
            label: 'Instances',
            controlType: 'input'
        },
        {
            attributeName: 'bonus_intelligence',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'bonusInt'
        },
        {
            attributeName: 'bonus_damage_per_instance',
            label: 'DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            },
            returnProperty: 'bonusDamage'
        }
    ],
    'invoker_ghost_walk': [
        {
            label: 'Quas Level',
            controlType: 'input'
        },
        {
            attributeName: 'enemy_slow',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                if (v == 0) {
                    return 0;
                }
                return abilityModel.getAbilityAttributeValue(ability.attributes, 'enemy_slow',v);
            },
            returnProperty: 'movementSpeedPctReduction'
        },
        {
            label: 'Wex Level',
            controlType: 'input',
            display: 'ability'
        },
        {
            attributeName: 'self_slow',
            label: 'Total Damage',
            controlType: 'text',
            display: 'ability',
            fn: function (v, a, parent, index, abilityModel, ability) {
                if (v == 0) {
                    return 0;
                }
                return abilityModel.getAbilityAttributeValue(ability.attributes, 'self_slow',v);
            },
            returnProperty: 'movementSpeedPct'
        }
    ],
    'invoker_alacrity': [
        {
            label: 'Wex Level',
            controlType: 'input'
        },
        {
            attributeName: 'bonus_attack_speed',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                if (v == 0) {
                    return 0;
                }
                return abilityModel.getAbilityAttributeValue(ability.attributes, 'bonus_attack_speed',v);
            },
            returnProperty: 'attackspeed'
        },
        {
            label: 'Exort Level',
            controlType: 'input',
        },
        {
            attributeName: 'bonus_damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                if (v == 0) {
                    return 0;
                }
                return abilityModel.getAbilityAttributeValue(ability.attributes, 'bonus_damage',v);
            },
            returnProperty: 'bonusDamage'
        }
    ],
    'invoker_ice_wall': [
        {
            label: 'Quas Level',
            controlType: 'input'
        },
        {
            attributeName: 'slow',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                if (v == 0) {
                    return 0;
                }
                return abilityModel.getAbilityAttributeValue(ability.attributes, 'slow',v);
            },
            returnProperty: 'movementSpeedPctReduction'
        },
        {
            label: 'Exort Level',
            controlType: 'input',
            display: 'ability'
        },
        {
            label: 'Duration',
            controlType: 'input',
            display: 'ability'
        },
        {
            attributeName: 'damage_per_second',
            label: 'DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            display: 'ability',
            controls: [1,2],
            fn: function (v, a, parent, index, abilityModel, ability) {
                if (v[0] == 0) {
                    return 0;
                }
                return abilityModel.getAbilityAttributeValue(ability.attributes, 'damage_per_second',v[0])*v[1];
            }
        }
    ],
    'jakiro_dual_breath': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            label: 'DAMAGE:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')*2 + 
                abilityModel.getAbilityAttributeValue(ability.attributes, 'burn_damage',ability.level())*v;
            }
        },
        {
            attributeName: 'slow_movement_speed_pct',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'movementSpeedPctReduction'
        },
        {
            attributeName: 'slow_attack_speed_pct',
            label: '%ATTACK SLOW:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'attackspeedreduction'
        }
    ],
    'jakiro_liquid_fire': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            attributeName: 'slow_attack_speed_pct',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'attackspeedreduction'
        }
    ],
    'jakiro_macropyre': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        }
    ],
    'juggernaut_blade_fury': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            label: 'DAMAGE:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')*v;
            }
        }
    ],
    'juggernaut_healing_ward': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            label: 'Max Health',
            controlType: 'input'
        },
        {
            attributeName: 'healing_ward_heal_amount',
            label: 'HEAL OVER TIME:',
            ignoreTooltip: true,
            controlType: 'text',
            controls: [0,1],
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v[0]*v[1]*a/100;
            }
        }
    ],
    'juggernaut_omni_slash': [
        {
            label: 'Jumps',
            controlType: 'input'
        },
        {
            label: 'MIN DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return abilityModel.getAbilityAttributeValue(ability.attributes, 'omni_slash_damage',1)*v;
            }
        },
        {
            label: 'MAX DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return abilityModel.getAbilityAttributeValue(ability.attributes, 'omni_slash_damage',2)*v;
            }
        }
    ],
    'keeper_of_the_light_illuminate': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage_per_second',
            label: 'DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        }
    ],
    'keeper_of_the_light_mana_leak': [
        {
            label: 'Distance Moved',
            controlType: 'input'
        },
        {
            label: 'Enemy Max Mana',
            controlType: 'input'
        },
        {
            attributeName: 'mana_leak_pct',
            label: 'MANA LEAKED:',
            ignoreTooltip: true,
            controlType: 'text',
            controls: [0,1],
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v[0]/100*v[1]*a/100;
            }
        }
    ],
    'legion_commander_duel': [
        {
            label: 'Duel Wins',
            controlType: 'input'
        },
        {
            attributeName: 'reward_damage',
            label: 'Total Damage:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            },
            returnProperty: 'bonusDamage'
        }
    ],
    'leshrac_pulse_nova': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            attributeName: 'mana_cost_per_second',
            label: 'MANA COST:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        }
    ],
    'lich_chain_frost': [
        {
            label: 'Bounce Hits',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            attributeName: 'slow_movement_speed',
            label: 'Enemy Movement Speed Slow',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'movementSpeedPctReduction'
        },
        {
            attributeName: 'slow_attack_speed',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'attackspeedreduction'
        }
    ],
    'life_stealer_feast': [
        {
            label: 'Enemy Current HP',
            controlType: 'input'
        },
        {
            attributeName: 'hp_leech_percent',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a/100;
            },
            returnProperty: 'bonusDamage'
        }
    ],
    'life_stealer_open_wounds': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'heal_percent',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'lifesteal'
        },
        {
            attributeName: 'slow_steps',
            label: '%SLOW:',
            ignoreTooltip: true,
            controlType: 'text',
            noLevel: true,
            fn: function (v, a, parent, index, abilityModel, ability) {
                return abilityModel.getAbilityAttributeValue(ability.attributes, 'slow_steps',v+1);
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
    'lina_fiery_soul': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'fiery_soul_move_speed_bonus',
            label: 'Enemy Movement Speed Slow',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            },
            returnProperty: 'movementSpeedPct'
        },
        {
            attributeName: 'fiery_soul_attack_speed_bonus',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            },
            returnProperty: 'attackspeed'
        }
    ],
    'lion_mana_drain': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'mana_per_second',
            label: 'MANA DRAINED:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        }
    ],
    'luna_moon_glaive': [
        {
            label: 'Damage',
            controlType: 'input'
        },
        {
            attributeName: 'damage_reduction_percent',
            label: 'BOUNCE DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var result = [];
                for (var i = 1; i < 6; i++) {
                    result.push((v*Math.pow(a/100,i)).toFixed(2))
                }
                return result.join('<br>');
            }
        }
    ],
    'luna_eclipse': [
        {
            label: 'Beam Count',
            controlType: 'input'
        },
        {
            attributeName: 'beams',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var lucentBeamAbility = abilityModel.abilities().find(function(b) {
                    return b.name == 'luna_lucent_beam';
                });
                if (lucentBeamAbility.level() == 0) return 0;
                var damage = abilityModel.getAbilityPropertyValue(lucentBeamAbility, 'damage');
                return v*damage;
            }
        }
    ],
    'medusa_mystic_snake': [
        {
            label: 'Jump Count',
            controlType: 'input'
        },
        {
            attributeName: 'snake_damage',
            label: 'Damage Per Jump:',
            ignoreTooltip: true,
            controlType: 'method',
            display: 'none',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var snake_jumps = abilityModel.getAbilityAttributeValue(ability.attributes, 'snake_jumps',ability.level());
                var snake_scale = abilityModel.getAbilityAttributeValue(ability.attributes, 'snake_scale',0);
                var damage = [];
                for (var i = 0; i < snake_jumps; i++) {
                    damage.push(a + a * i * snake_scale/100);
                }
                return damage;
            }
        },
        {
            attributeName: 'snake_damage',
            label: 'Damage Per Jump:',
            ignoreTooltip: true,
            controlType: 'text',
            controls: [0,1],
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v[1].join(' / ');
            }
        },
        {
            attributeName: 'snake_damage',
            label: 'Total Damage:',
            ignoreTooltip: true,
            controlType: 'text',
            controls: [0,1],
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v[1].slice(0, v[0]).reduce(function (memo, o) { return memo + o }, 0);
            }
        },
        {
            attributeName: 'snake_damage',
            label: 'Max Damage:',
            ignoreTooltip: true,
            controlType: 'text',
            controls: [0,1],
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v[1].reduce(function (memo, o) { return memo + o }, 0);
            }
        }
    ],
    'medusa_mana_shield': [
        {
            label: 'Damage',
            controlType: 'input'
        },
        {
            attributeName: 'damage_per_mana',
            label: 'MANA USED:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return (v/a).toFixed(2);
            }
        },
        {
            attributeName: 'absorption_tooltip',
            label: '%DAMAGE REDUCTION:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return -a;
            },
            returnProperty: 'damageReduction'
        }
    ],
    'meepo_poof': [
        {
            label: 'Meepo Count',
            controlType: 'input'
        },
        {
            label: 'DAMAGE:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')*v;
            }
        }
    ],
    'meepo_geostrike': [
        {
            label: 'Stacks',
            controlType: 'input'
        },
        {
            label: 'DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')*v;
            }
        },
        {
            attributeName: 'slow',
            label: '%SLOW:',
            ignoreTooltip: true,
            controlType: 'text',
            noLevel: true,
            fn: function (v, a, parent, index, abilityModel, ability) {
                return abilityModel.getAbilityAttributeValue(ability.attributes, 'slow',ability.level())*v;
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
    'mirana_arrow': [
        {
            label: 'Arrow Travel Distance',
            controlType: 'input'
        },
        {
            attributeName: 'arrow_max_stun',
            label: 'STUN DURATION:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var arrow_min_stun = abilityModel.getAbilityAttributeValue(ability.attributes, 'arrow_min_stun',0);
                var arrow_max_stunrange = abilityModel.getAbilityAttributeValue(ability.attributes, 'arrow_max_stunrange',0);
                var scale = Math.min(v, arrow_max_stunrange) / arrow_max_stunrange;
                return Math.max(arrow_min_stun, Math.floor(a * scale / 0.1) * 0.1);
            }
        },
        {
            attributeName: 'arrow_bonus_damage',
            label: 'TOTAL DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var ability = ability;
                var damage = ability.damage()[ability.level()-1];
                var arrow_max_stunrange = abilityModel.getAbilityAttributeValue(ability.attributes, 'arrow_max_stunrange',0);
                var scale = Math.min(v, arrow_max_stunrange) / arrow_max_stunrange;
                var bonus_damage = Math.floor(a * scale / 2.8) * 2.8;
                return damage + ' + ' + bonus_damage + ' = ' + (damage + bonus_damage);
            }
        }
    ],
    'morphling_morph_agi': [
        {
            label: 'Shifts',
            controlType: 'input'
        },
        {
            attributeName: 'points_per_tick',
            label: 'AGI SHIFT GAIN:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            },
            returnProperty: 'bonusAgility'
        },
        {
            attributeName: 'points_per_tick',
            label: 'STR SHIFT LOSS:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return -v*a;
            },
            returnProperty: 'bonusStrength'
        },
        {
            attributeName: 'bonus_attributes',
            label: 'SHIFT TIME:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'bonusAgility2'
        },
        {
            attributeName: 'morph_cooldown',
            label: 'SHIFT TIME:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            attributeName: 'mana_cost',
            label: 'SHIFT MANA COST:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a*abilityModel.getAbilityAttributeValue(ability.attributes, 'morph_cooldown',ability.level());
            }
        }
    ],
    'morphling_morph_str': [
        {
            label: 'Shifts',
            controlType: 'input'
        },
        {
            attributeName: 'points_per_tick',
            label: 'STR SHIFT GAIN:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            },
            returnProperty: 'bonusStrength'
        },
        {
            attributeName: 'points_per_tick',
            label: 'AGI SHIFT LOSS:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return -v*a;
            },
            returnProperty: 'bonusAgility'
        },
        {
            attributeName: 'bonus_attributes',
            label: 'SHIFT TIME:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'bonusStrength2'
        },
        {
            attributeName: 'morph_cooldown',
            label: 'SHIFT TIME:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            attributeName: 'mana_cost',
            label: 'SHIFT MANA COST:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a*abilityModel.getAbilityAttributeValue(ability.attributes, 'morph_cooldown',ability.level());
            }
        }
    ],
    'furion_wrath_of_nature': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        }
    ],
    'necrolyte_heartstopper_aura': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            label: 'Enemy Max Health',
            controlType: 'input'
        },
        {
            attributeName: 'aura_damage',
            label: 'HEALTH LOST:',
            ignoreTooltip: true,
            controlType: 'text',
            controls: [0,1],
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v[0]*v[1]*a/100;
            }
        }
    ],
    'necrolyte_sadist': [
        {
            label: 'Unit Kills',
            controlType: 'input'
        },
        {
            label: 'Hero Kills',
            controlType: 'input'
        },
        {
            attributeName: 'health_regen',
            label: 'Total Damage',
            controlType: 'text',
            controls: [0,1],
            fn: function (v, a, parent, index, abilityModel, ability) {
                var hero_multiplier = abilityModel.getAbilityAttributeValue(ability.attributes, 'hero_multiplier',0)
                return (v[0]+v[1]*hero_multiplier)*a;
            },
            returnProperty: 'healthregen'
        },
        {
            attributeName: 'mana_regen',
            label: 'Total Damage',
            controlType: 'text',
            controls: [0,1],
            fn: function (v, a, parent, index, abilityModel, ability) {
                var hero_multiplier = abilityModel.getAbilityAttributeValue(ability.attributes, 'hero_multiplier',0)
                return (v[0]+v[1]*hero_multiplier)*a;
            },
            returnProperty: 'manaregen'
        }
    ],
    'night_stalker_crippling_fear': [
        {
            label: 'Is Night',
            controlType: 'checkbox'
        },
        {
            attributeName: 'miss_rate_night',
            label: '%CHANCE TO MISS:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                if (v) {
                    return abilityModel.getAbilityAttributeValue(ability.attributes, 'miss_rate_night',ability.level());
                }
                else {
                    return abilityModel.getAbilityAttributeValue(ability.attributes, 'miss_rate_day',ability.level());
                }
            },
            returnProperty: 'missChance'
        }
    ],    
    'night_stalker_hunter_in_the_night': [
        {
            label: 'Is Night',
            controlType: 'checkbox'
        },
        {
            attributeName: 'bonus_attack_speed_night',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                if (v) {
                    return a;
                }
                else {
                    return 0;
                }
            },
            returnProperty: 'attackspeed'
        },
        {
            attributeName: 'bonus_movement_speed_pct_night',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                if (v) {
                    return a;
                }
                else {
                    return 0;
                }
            },
            returnProperty: 'movementSpeedPct'
        }
    ],    
    'obsidian_destroyer_arcane_orb': [
        {
            label: 'Current Mana',
            controlType: 'input'
        },
        {
            attributeName: 'mana_pool_damage_pct',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a/100;
            },
            returnProperty: 'bonusDamageOrb'
        }
    ],
    'ogre_magi_ignite': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'burn_damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            attributeName: 'slow_movement_speed_pct',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
    'pudge_rot': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            label: 'DAMAGE:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')*v;
            }
        },
        {
            attributeName: 'rot_slow',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
    'pudge_flesh_heap': [
        {
            label: 'Stacks',
            controlType: 'input'
        },
        {
            attributeName: 'flesh_heap_strength_buff_amount',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            },
            returnProperty: 'bonusStrength'
        },
        {
            attributeName: 'flesh_heap_magic_resist',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'magicResist'
        }
    ],
    'pudge_dismember': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'dismember_damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        }
    ],
    'pugna_nether_ward': [
        {
            label: 'Enemy Mana Spent',
            controlType: 'input'
        },
        {
            attributeName: 'mana_multiplier',
            label: 'DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            attributeName: 'mana_regen',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'manaregenreduction'
        }
    ],
    'pugna_life_drain': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'health_drain',
            label: 'HEALTH DRAINED:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        }
    ],
    'queenofpain_shadow_strike': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'movement_slow',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'movementSpeedPctReduction'
        },
        {
            attributeName: 'strike_damage',
            label: 'Total Damage:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var duration_damage = abilityModel.getAbilityAttributeValue(ability.attributes, 'duration_damage',ability.level());
                var ticks = Math.floor(v/3);
                return a + duration_damage * ticks;
            }
        }
    ],
    'razor_plasma_field': [
        {
            label: 'Distance',
            controlType: 'input'
        },
        {
            attributeName: 'radius',
            label: 'MIN DISTANCE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return 200;
            }
        },
        {
            attributeName: 'radius',
            label: 'MAX DISTANCE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return 200 + a;
            }
        },
        {
            attributeName: 'radius',
            label: 'Instance Damage',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var max_radius = a + 200;
                var scale = (Math.min(Math.max(v, 200), max_radius) - 200) / (max_radius - 200);
                var damage_min = abilityModel.getAbilityAttributeValue(ability.attributes, 'damage_min',ability.level());
                var damage_max = abilityModel.getAbilityAttributeValue(ability.attributes, 'damage_max',ability.level());
                return damage_min + (damage_max - damage_min) * scale;
            }
        }
    ],
    'razor_static_link': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'drain_length',
            label: 'Damage Drained:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var tick_duration = Math.floor(v * 4) + 1;
                var ticks = Math.min(a * 4 + 1, tick_duration);
                var drain_rate = abilityModel.getAbilityAttributeValue(ability.attributes, 'drain_rate',ability.level());
                return ticks * drain_rate/4;
            },
            returnProperty: 'bonusDamage'
        },
        {
            attributeName: 'drain_length',
            label: 'Enemy Damage Lost:',
            ignoreTooltip: true,
            controlType: 'text',
            display: 'hidden',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var tick_duration = Math.floor(v * 4) + 1;
                var ticks = Math.min(a * 4 + 1, tick_duration);
                var drain_rate = abilityModel.getAbilityAttributeValue(ability.attributes, 'drain_rate',ability.level());
                return ticks * drain_rate/4;
            },
            returnProperty: 'bonusDamageReduction'
        }
    ],
    'razor_eye_of_the_storm': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        }
    ],
    'rubick_fade_bolt': [
        {
            label: 'Jumps',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a * (1 - v*abilityModel.getAbilityAttributeValue(ability.attributes, 'jump_damage_reduction_pct',ability.level())/100);
            }
        },
        {
            attributeName: 'hero_attack_damage_reduction',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'bonusDamageReduction'
        }
    ],
    'sandking_sand_storm': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            label: 'DAMAGE:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')*v;
            }
        }
    ],
    'sandking_epicenter': [
        {
            label: 'Pulses',
            controlType: 'input'
        },
        {
            attributeName: 'epicenter_damage',
            label: 'DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            attributeName: 'epicenter_slow',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'movementSpeedPctReduction'
        },
        {
            attributeName: 'epicenter_slow_as',
            label: '%ATTACK SLOW:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'attackspeedreduction'
        }
    ],
    'shadow_demon_shadow_poison': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'stack_damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var stackmult = [1,2,4,8];
                if (v > 4) {
                    return a * stackmult[3] + 50 * (v - 4);
                }
                else if (v <= 0) {
                    return 0
                }
                else {
                    return a * stackmult[v-1]
                }
            }
        }
    ],
    'nevermore_necromastery': [
        {
            label: 'Souls',
            controlType: 'input'
        },
        {
            attributeName: 'necromastery_damage_per_soul',
            label: 'DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            },
            returnProperty: 'bonusDamage'
        }
    ],
    'nevermore_requiem': [
        {
            label: 'Line Hit Count',
            controlType: 'input'
        },
        {
            attributeName: 'requiem_reduction_damage',
            label: 'Damage:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')*v;
            }
        },
        {
            label: 'Return Line Hit Count (Scepter)',
            controlType: 'input'
        },
        {
            attributeName: 'requiem_damage_pct_scepter',
            label: 'Damage/Heal:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')*v*a/100;
            }
        },
        {
            attributeName: 'requiem_damage_pct_scepter',
            label: 'Total Damage:',
            ignoreTooltip: true,
            controlType: 'text',
            controls: [0,1],
            fn: function (v, a, parent, index, abilityModel, ability) {
                var damage = abilityModel.getAbilityPropertyValue(ability, 'damage');
                return damage*v[0] + damage*v[1]*a/100;
            }
        },
        {
            attributeName: 'requiem_reduction_damage',
            label: '%DAMAGE REDUCTION:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'baseDamageReductionPct'
        },
        {
            attributeName: 'requiem_reduction_ms',
            label: '%DAMAGE REDUCTION:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
    'shadow_shaman_shackles': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            label: 'DAMAGE:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')*v;
            }
        }
    ],
    'silencer_curse_of_the_silent': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return Math.floor(v)*a;
            }
        },
        {
            attributeName: 'movespeed',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
/*        'silencer_glaives_of_wisdom': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        }
    ],*/
    'skywrath_mage_mystic_flare': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        }
    ],
    'slark_essence_shift': [
        {
            label: 'Attacks',
            controlType: 'input'
        },
        {
            attributeName: 'agi_gain',
            label: 'Total Damage',
            controlType: 'text',
            display: 'ability',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            },
            returnProperty: 'bonusAgility'
        },
        {
            attributeName: 'stat_loss',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return -v*a;
            },
            returnProperty: 'bonusAllStatsReduction'
        }
    ],
    'slark_shadow_dance': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'bonus_regen_pct',
            label: 'TOTAL HEALTH REGENERATED:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*parent.health()*a/100;
            }
        },
        {
            attributeName: 'bonus_regen_pct',
            label: 'HEALTH GAINED PER SECOND:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return parent.health()*a/100;
            },
            returnProperty: 'healthregen'
        },
        {
            attributeName: 'bonus_movement_speed',
            label: '%MOVE SPEED:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'movementSpeedPct'
        }
    ],
    'sniper_shrapnel': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            label: 'DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')*v;
            }
        },
        {
            attributeName: 'building_damage',
            label: 'BUILDING DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            attributeName: 'slow_movement_speed',
            label: 'Enemy Movement Speed Slow',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
    'spectre_desolate': [
        {
            label: 'Enemy Alone',
            controlType: 'checkbox'
        },
        {
            attributeName: 'bonus_damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                if (v) {
                    return a;
                }
                else {
                    return 0;
                }
            },
            returnProperty: 'bonusDamage'
        }
    ],
    'spectre_dispersion': [
        {
            label: 'Damage Taken',
            controlType: 'input'
        },
        {
            attributeName: 'damage_reflection_pct',
            label: 'DAMAGE REFLECTED:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return -a;
            },
            returnProperty: 'damageReduction'
        },
        {
            attributeName: 'damage_reflection_pct',
            label: 'DAMAGE REFLECTED:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a/100;
            }
        }
    ],
    'storm_spirit_ball_lightning': [
        {
            label: 'MAX MANA',
            controlType: 'input'
        },
        {
            label: 'Distance',
            controlType: 'input'
        },
        {
            attributeName: 'ball_lightning_initial_mana_base',
            label: 'Total Damage:',
            ignoreTooltip: true,
            controlType: 'text',
            controls: [0, 1],
            fn: function (v, a, parent, index, abilityModel, ability) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')/100*v[1];
            }
        },
        {
            attributeName: 'ball_lightning_initial_mana_base',
            label: 'FLAT MANA COST:',
            ignoreTooltip: true,
            controlType: 'method',
            controls: [0, 1],
            fn: function (v, a, parent, index, abilityModel, ability) {
                var distance_intervals = Math.floor(v[1]/100);
                var travel_cost_base = abilityModel.getAbilityAttributeValue(ability.attributes, 'ball_lightning_travel_cost_base',0);
                return a + distance_intervals * travel_cost_base;
            }
        },
        {
            attributeName: 'ball_lightning_initial_mana_percentage',
            label: '%MAX MANA COST:',
            ignoreTooltip: true,
            controlType: 'method',
            controls: [0, 1],
            fn: function (v, a, parent, index, abilityModel, ability) {
                var distance_intervals = Math.floor(v[1]/100);
                var travel_cost_percent = abilityModel.getAbilityAttributeValue(ability.attributes, 'ball_lightning_travel_cost_percent',0);
                return a + distance_intervals * travel_cost_percent;
            }
        },
        {
            attributeName: 'ball_lightning_initial_mana_base',
            label: 'TOTAL MANA COST:',
            ignoreTooltip: true,
            controlType: 'text',
            controls: [0, 1, 2, 3],
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v[2] + ' + ' + (v[3]/100 * v[0]) + ' (' + v[3] + '% of max) = ' + (v[2] + v[3]/100 * v[0]);
            }
        }
    ],
    'templar_assassin_psionic_trap': [
        {
            label: 'Charge Time',
            controlType: 'input'
        },
        {
            attributeName: 'movement_speed_min_tooltip',
            label: '%MOVE SLOW:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var max_slow = abilityModel.getAbilityAttributeValue(ability.attributes, 'movement_speed_max_tooltip',0);
                var slow_per_tick = (max_slow - a)/40;
                return -(a + slow_per_tick * Math.min(Math.max(0, v), 4) * 10);
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
    'shredder_reactive_armor': [
        {
            label: 'Stacks',
            controlType: 'input'
        },
        {
            attributeName: 'bonus_armor',
            label: 'Total Armor Bonus',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            },
            returnProperty: 'armor'
        },
        {
            attributeName: 'bonus_hp_regen',
            label: 'Total HP Regen Bonus',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            },
            returnProperty: 'healthregen'
        }
    ],
    'shredder_chakram': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage_per_second',
            label: 'DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var interval = abilityModel.getAbilityAttributeValue(ability.attributes, 'damage_interval',0);
                var ticks = Math.floor(v / interval);
                return a*interval*ticks;
            }
        },
        {
            attributeName: 'mana_per_second',
            label: 'MANA COST:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var interval = abilityModel.getAbilityAttributeValue(ability.attributes, 'damage_interval',0);
                var ticks = Math.floor(v / interval);
                return a*interval*ticks;
            }
        },
        {
            label: 'ENEMY %HP',
            controlType: 'input'
        },
        {
            attributeName: 'slow',
            label: 'MANA COST:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var ticks = 20 - Math.floor(Math.min(Math.max(v-1, 0), 99) / 5);
                return -a*ticks;
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
    'spirit_breaker_greater_bash': [
        {
            label: 'Bash Proc',
            controlType: 'checkbox'
        },
        {
            attributeName: 'damage',
            label: '%MOVESPEED AS DAMAGE',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                if (v) {
                    return a;
                }
                else {
                    return 0;
                }
            },
            returnProperty: 'bashBonusDamage'
        },
        {
            attributeName: 'bonus_movespeed_pct',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                if (v) {
                    return a;
                }
                else {
                    return 0;
                }
            },
            returnProperty: 'movementSpeedPct'
        },
        {
            attributeName: 'chance_pct',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a
            },
            returnProperty: 'bash'
        }
    ],
    'techies_land_mines': [
        {
            label: 'Number of Mines',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            attributeName: 'damage',
            label: 'AFTER REDUCTIONS:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var phys_reduction = parent.enemy().totalArmorPhysicalReduction(),
                    magic_reduction = parent.enemy().totalMagicResistance();
                return (v * a * (1 - phys_reduction / 100) * (1 - magic_reduction / 100)).toFixed(2);
            }
        }
    ],
    'techies_suicide': [
        {
            attributeName: 'damage',
            label: 'FULL DAMAGE AFTER REDUCTIONS:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var phys_reduction = parent.enemy().totalArmorPhysicalReduction(),
                    magic_reduction = parent.enemy().totalMagicResistance();
                return (a * (1 - phys_reduction / 100) * (1 - magic_reduction / 100)).toFixed(2);
            }
        },
        {
            attributeName: 'partial_damage',
            label: 'PARTIAL DAMAGE AFTER REDUCTIONS:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var phys_reduction = parent.enemy().totalArmorPhysicalReduction(),
                    magic_reduction = parent.enemy().totalMagicResistance();
                return (a * (1 - phys_reduction / 100) * (1 - magic_reduction / 100)).toFixed(2);
            }
        },
        {
            attributeName: 'damage',
            label: 'RESPAWN TIME:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return (parent.respawnTime() / 2).toFixed(0) + ' seconds';
            }
        }
    ],
    'techies_remote_mines': [
        {
            label: 'Number of Mines',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            attributeName: 'damage',
            label: 'AFTER REDUCTIONS:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var magic_reduction = parent.enemy().totalMagicResistance();
                return (v * a * (1 - magic_reduction / 100)).toFixed(2);
            }
        }
    ],
    'tinker_march_of_the_machines': [
        {
            label: 'Robot Explosions',
            controlType: 'input'
        },
        {
            attributeName: 'machines_per_sec',
            label: 'TOTAL DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')*v;
            }
        }
    ],
    'treant_leech_seed': [
        {
            label: 'Pulses',
            controlType: 'input'
        },
        {
            attributeName: 'leech_damage',
            label: 'DAMAGE/HEAL:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            attributeName: 'movement_slow',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
    'troll_warlord_fervor': [
        {
            label: 'Stacks',
            controlType: 'input'
        },
        {
            attributeName: 'attack_speed',
            label: 'ATTACK SPEED:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            },
            returnProperty: 'attackspeed'
        }
    ],
    'undying_decay': [
        {
            label: 'Stacks',
            controlType: 'input'
        },
        {
            attributeName: 'str_steal',
            label: 'STRENGTH STOLEN:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                if (parent.inventory.hasScepter()) {
                    var str_steal_scepter = abilityModel.getAbilityAttributeValue(ability.attributes, 'str_steal_scepter',0);
                    return v*str_steal_scepter;
                }
                else {
                    return v*a;
                }
            },
            returnProperty: 'bonusStrength'
        },
    ],
    'undying_soul_rip': [
        {
            label: 'Units',
            controlType: 'input'
        },
        {
            attributeName: 'damage_per_unit',
            label: 'DAMAGE/HEAL:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        }
    ],
    'undying_flesh_golem': [
        {
            label: 'Distance',
            controlType: 'input'
        },
        {
            attributeName: 'max_speed_slow',
            label: '%MOVE SLOW:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var min_speed_slow = abilityModel.getAbilityAttributeValue(ability.attributes, 'min_speed_slow', 0);
                var radius = abilityModel.getAbilityAttributeValue(ability.attributes, 'radius', 0);
                var full_power_radius = abilityModel.getAbilityAttributeValue(ability.attributes, 'full_power_radius', 0);
                var distance = Math.min(Math.max(v, full_power_radius), radius);
                var scale = 1 - (distance - full_power_radius) / (radius - full_power_radius);
                return -Math.max(scale * a, min_speed_slow);
            },
            returnProperty: 'movementSpeedPctReduction'
        },
        {
            attributeName: 'max_damage_amp',
            label: '%DAMAGE AMP:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var min_damage_amp = abilityModel.getAbilityAttributeValue(ability.attributes, 'min_damage_amp', 0);
                var radius = abilityModel.getAbilityAttributeValue(ability.attributes, 'radius', 0);
                var full_power_radius = abilityModel.getAbilityAttributeValue(ability.attributes, 'full_power_radius', 0);
                var distance = Math.min(Math.max(v, full_power_radius), radius);
                var scale = 1 - (distance - full_power_radius) / (radius - full_power_radius);
                return Math.max(scale * a, min_damage_amp);
            },
            returnProperty: 'damageAmplification'
        },
        {
            label: 'MAX HP',
            controlType: 'input'
        },
        {
            label: 'Hero Death Count',
            controlType: 'input'
        },
        {
            label: 'Creep Death Count',
            controlType: 'input'
        },
        {
            attributeName: 'death_heal',
            label: 'DEATH HEAL (HEROES):',
            ignoreTooltip: true,
            controlType: 'method',
            controls: [1, 2],
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v[0]*v[1]*a/100;
            }
        },
        {
            attributeName: 'death_heal_creep',
            label: 'DEATH HEAL (CREEPS):',
            ignoreTooltip: true,
            controlType: 'method',
            controls: [1, 3],
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v[0]*v[1]*a/100;
            }
        },
        {
            attributeName: 'death_heal_creep',
            label: 'TOTAL DEATH HEAL:',
            ignoreTooltip: true,
            controlType: 'text',
            controls: [4, 5],
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v[0]+v[1];
            }
        }
    ],
    'ursa_fury_swipes': [
        {
            label: 'Stacks',
            controlType: 'input'
        },
        {
            attributeName: 'damage_per_stack',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var enrageAbility = abilityModel.abilities().find(function(b) {
                    return b.name == 'ursa_enrage';
                });
                if (enrageAbility.isActive() && enrageAbility.level() > 0) {
                    var enrage_multiplier = abilityModel.getAbilityAttributeValue(enrageAbility.attributes, 'enrage_multiplier', enrageAbility.level());
                    return v*a*enrage_multiplier;
                }
                return v*a;
            },
            returnProperty: 'bonusDamage'
        }
    ],
    'ursa_enrage': [
        {
            attributeName: 'damage_reduction',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return -a;
            },
            returnProperty: 'damageReduction'
        }
    ],
    'venomancer_venomous_gale': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'tick_damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return abilityModel.getAbilityAttributeValue(ability.attributes, 'strike_damage',ability.level()) + Math.floor(v/3)*a;
            }
        },
        {
            attributeName: 'movement_slow',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
    'venomancer_poison_sting': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            attributeName: 'movement_speed',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
    'venomancer_poison_nova': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        }
    ],
    'viper_poison_attack': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            attributeName: 'bonus_movement_speed',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'movementSpeedPctReduction'
        },
        {
            attributeName: 'bonus_attack_speed',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'attackspeedreduction'
        }
    ],
    'viper_corrosive_skin': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            attributeName: 'bonus_movement_speed',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'movementSpeedPctReduction'
        },
        {
            attributeName: 'bonus_attack_speed',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'attackspeedreduction'
        },
        {
            attributeName: 'bonus_magic_resistance',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'magicResist'
        }
    ],
    'viper_viper_strike': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            attributeName: 'bonus_movement_speed',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'movementSpeedPctReduction'
        },
        {
            attributeName: 'bonus_attack_speed',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'attackspeedreduction'
        }
    ],
    'visage_soul_assumption': [
        {
            label: 'Charges',
            controlType: 'input'
        },
        {
            attributeName: 'soul_charge_damage',
            label: 'Total Damage:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var soul_base_damage = abilityModel.getAbilityAttributeValue(ability.attributes, 'soul_base_damage',0);
                var stack_limit = abilityModel.getAbilityAttributeValue(ability.attributes, 'stack_limit', ability.level());
                stack_limit = Math.max(Math.min(v, stack_limit), 0);
                return soul_base_damage + stack_limit*a;
            }
        }
    ],
    'visage_gravekeepers_cloak': [
        {
            label: 'Layers',
            controlType: 'input'
        },
        {
            attributeName: 'bonus_armor',
            label: 'ARMOR:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            },
            returnProperty: 'armor'
        },
        {
            attributeName: 'bonus_resist',
            label: '%RESIST:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            },
            returnProperty: 'magicResist'
        }
    ],
    'warlock_shadow_word': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            label: 'DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')*v;
            }
        }
    ],
    'warlock_upheaval': [
        {
            label: 'Channel Duration',
            controlType: 'input'
        },
        {
            attributeName: 'slow_rate_duration',
            label: '%MOVE SLOW:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var max_slow = abilityModel.getAbilityAttributeValue(ability.attributes, 'max_slow',0);
                var slow_per_tick = max_slow / (a - 0.5) / 2;
                var ticks = Math.max(Math.floor(v * 2) - 1, 0);
                return -Math.min(ticks * slow_per_tick, max_slow);
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
    'weaver_the_swarm': [
        {
            label: 'Attacks',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'DAMAGE:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            attributeName: 'armor_reduction',
            label: 'DAMAGE:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return -v*a;
            },
            returnProperty: 'armorReduction'
        }
    ],
    'windrunner_powershot': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            label: 'DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')*v;
            }
        }
    ],
    'winter_wyvern_cold_embrace': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            label: 'Ally Max Health',
            controlType: 'input'
        },
        {
            attributeName: 'heal_percentage',
            label: 'TOTAL HEAL:',
            ignoreTooltip: true,
            controlType: 'text',
            controls: [0,1],
            fn: function (v, a, parent, index, abilityModel, ability) {
                var base_heal = abilityModel.getAbilityAttributeValue(ability.attributes, 'heal_additive',ability.level());
                return (base_heal + v[1] * a/100) * v[0];
            }
        }
    ],
    'wisp_spirits': [
        {
            label: 'Collision Count',
            controlType: 'input'
        },
        {
            attributeName: 'hero_damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            attributeName: 'creep_damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        }
    ],
    'wisp_overcharge': [
        {
            label: 'Current HP',
            controlType: 'input'
        },
        {
            attributeName: 'drain_pct',
            label: 'HP DRAINED:',
            ignoreTooltip: true, 
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            label: 'Current MP',
            controlType: 'input'
        },
        {
            attributeName: 'drain_pct',
            label: 'MP DRAINED:',
            ignoreTooltip: true, 
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            attributeName: 'bonus_attack_speed',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'attackspeed'
        },
        {
            attributeName: 'bonus_damage_pct',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'damageReduction'
        }
    ],
    'witch_doctor_paralyzing_cask': [
        {
            label: 'Hero Bounce Count',
            controlType: 'input'
        },
        {
            attributeName: 'hero_damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var bounces = abilityModel.getAbilityAttributeValue(ability.attributes, 'bounces',ability.level());
                return Math.min(Math.max(v, 0), bounces)*a;
            }
        },
        {
            label: 'Creep Bounce Count',
            controlType: 'input'
        },
        {
            attributeName: 'hero_damage',
            label: 'CREEP DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var bounces = abilityModel.getAbilityAttributeValue(ability.attributes, 'bounces',ability.level());
                var damage = abilityModel.getAbilityPropertyValue(ability, 'damage');
                return Math.min(Math.max(v, 0), bounces)*damage;
            }
        }
    ],
    'witch_doctor_voodoo_restoration': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'heal',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var interval = abilityModel.getAbilityAttributeValue(ability.attributes, 'heal_interval',ability.level());
                var heal_per_tick = a * interval;
                var ticks = Math.max(Math.floor(v / interval) - 1, 0);
                return heal_per_tick * ticks;
            }
        },
        {
            attributeName: 'mana_per_second',
            label: 'MANA COST:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var interval = abilityModel.getAbilityAttributeValue(ability.attributes, 'heal_interval',ability.level());
                var mana_per_tick = a * interval;
                var ticks = Math.max(Math.floor(v / interval) - 1, 0);
                return mana_per_tick * ticks;
            }
        }
    ],
    'witch_doctor_maledict': [
        {
            label: 'damage 0-4s',
            controlType: 'input'
        },
        {
            label: 'damage 4-8s',
            controlType: 'input'
        },
        {
            label: 'damage 8-12s',
            controlType: 'input'
        },
        {
            attributeName: 'bonus_damage',
            label: 'Dot Damage after 3s:',
            ignoreTooltip: true,
            controlType: 'method',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var damage = abilityModel.getAbilityPropertyValue(ability, 'damage');
                return 3*damage;
            }
        },
        {
            attributeName: 'bonus_damage',
            label: 'Burst Damage at 4s:',
            ignoreTooltip: true,
            controlType: 'method',
            controls: [0, 3],
            fn: function (v, a, parent, index, abilityModel, ability) {
                var damage = abilityModel.getAbilityPropertyValue(ability, 'damage');
                var d = v.reduce(function (memo, o) { return memo + o }, 0);
                return Math.max(d, 0) * a/100;
            }
        },
        {
            attributeName: 'bonus_damage',
            label: 'Dot Damage after 7s:',
            ignoreTooltip: true,
            controlType: 'method',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var damage = abilityModel.getAbilityPropertyValue(ability, 'damage');
                return 7*damage;
            }
        },
        {
            attributeName: 'bonus_damage',
            label: 'Burst Damage at 8s:',
            ignoreTooltip: true,
            controlType: 'method',
            controls: [0, 1, 4, 5],
            fn: function (v, a, parent, index, abilityModel, ability) {
                var damage = abilityModel.getAbilityPropertyValue(ability, 'damage');
                var d = v.reduce(function (memo, o) { return memo + o }, 0);
                return Math.max(d, 0) * a/100;
            }
        },
        {
            attributeName: 'bonus_damage',
            label: 'Dot Damage after 11s:',
            ignoreTooltip: true,
            controlType: 'method',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var damage = abilityModel.getAbilityPropertyValue(ability, 'damage');
                return 11*damage;
            }
        },
        {
            attributeName: 'bonus_damage',
            label: 'Burst Damage at 12s:',
            ignoreTooltip: true,
            controlType: 'method',
            controls: [0, 1, 2, 4, 6, 7],
            fn: function (v, a, parent, index, abilityModel, ability) {
                var damage = abilityModel.getAbilityPropertyValue(ability, 'damage');
                var d = v.reduce(function (memo, o) { return memo + o }, 0);
                return Math.max(d, 0) * a/100;
            }
        },
        {
            attributeName: 'bonus_damage',
            label: 'Total Burst Damage:',
            ignoreTooltip: true,
            controlType: 'method',
            controls: [4, 6, 8],
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v.reduce(function (memo, o) { return memo + o }, 0);
            }
        },
        {
            attributeName: 'bonus_damage',
            label: 'Total Maledict Damage:',
            ignoreTooltip: true,
            controlType: 'method',
            controls: [9],
            fn: function (v, a, parent, index, abilityModel, ability) {
                var duration = abilityModel.getAbilityAttributeValue(ability.attributes, 'duration_tooltip',0);
                var damage = abilityModel.getAbilityPropertyValue(ability, 'damage');
                return damage * duration + v[0];
            }
        },
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'bonus_damage',
            label: 'DOT Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var duration = abilityModel.getAbilityAttributeValue(ability.attributes, 'duration_tooltip',0);
                return abilityModel.getAbilityPropertyValue(ability, 'damage')*Math.min(Math.max(v, 0), duration);
            }
        }
    ],
    'witch_doctor_death_ward': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        }
    ],
    'zuus_static_field': [
        {
            label: 'Enemy HP',
            controlType: 'input'
        },
        {
            attributeName: 'damage_health_pct',
            label: 'DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a/100;
            }
        }
    ]
}

module.exports = abilityData;
},{}],19:[function(require,module,exports){
(function (global){
'use strict';
var ko = (typeof window !== "undefined" ? window['ko'] : typeof global !== "undefined" ? global['ko'] : null);

ko.mapping = require('../lib/knockout.mapping');
ko.wrap = require('../lib/knockout.wrap');

ko.extenders.numeric = function(target, opts) {
    //create a writable computed observable to intercept writes to our observable
    var result = ko.pureComputed({
        read: target,  //always return the original observables value
        write: function(newValue) {
            var current = target(),
                roundingMultiplier = Math.pow(10, (opts === Object(opts) ? opts.precision : opts) || 0),
                newValueAsNum = isNaN(newValue) ? (opts.defaultValue || 0) : +newValue,
                valueToWrite = Math.round(newValueAsNum * roundingMultiplier) / roundingMultiplier;
 
            //only write if it changed
            if (valueToWrite !== current) {
                target(valueToWrite);
            } else {
                //if the rounded value is the same, but a different value was written, force a notification for the current field
                if (newValue !== current) {
                    target.notifySubscribers(valueToWrite);
                }
            }
        }
    }).extend({ notify: 'always' });
 
    //initialize with current value to make sure it is rounded appropriately
    result(target());
 
    //return the new computed observable
    return result;
};

module.exports = ko;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../lib/knockout.mapping":40,"../lib/knockout.wrap":41}],20:[function(require,module,exports){
var illusionData = {
    chaos_knight_phantasm: {
        hero: 'chaos_knight',
        displayName: 'Chaos Knight Phantasm',
        use_selected_hero: false,
        max_level: 3,
        outgoing_damage: 'outgoing_damage',
        incoming_damage: 'incoming_damage'
    },
    naga_siren_mirror_image: {
        hero: 'naga_siren',
        displayName: 'Naga Siren Mirror Image',
        use_selected_hero: false,
        max_level: 4,
        outgoing_damage: 'outgoing_damage',
        incoming_damage: 'incoming_damage'
    },
    dark_seer_wall_of_replica: {
        hero: 'dark_seer',
        displayName: 'Dark Seer Wall of Replica',
        use_selected_hero: true,
        max_level: 3,
        outgoing_damage: 'replica_damage_outgoing',
        incoming_damage: 'replica_damage_incoming',
        outgoing_damage_scepter: 'replica_damage_outgoing_scepter'
    },
    morphling_replicate: {
        hero: 'morphling',
        displayName: 'Morphling Replicate',
        use_selected_hero: true,
        max_level: 3,
        outgoing_damage: 'illusion_damage_out_pct',
        incoming_damage: 'illusion_damage_in_pct'
    },
    phantom_lancer_doppelwalk: {
        hero: 'phantom_lancer',
        displayName: 'Phantom Lancer Doppelwalk',
        use_selected_hero: false,
        max_level: 4,
        outgoing_damage: 'illusion_damage_out_pct',
        incoming_damage: 'illusion_damage_in_pct'        
    },
    phantom_lancer_juxtapose: {
        hero: 'phantom_lancer',
        displayName: 'Phantom Lancer Juxtapose',
        use_selected_hero: false,
        max_level: 4,
        outgoing_damage: 'illusion_damage_out_pct',
        incoming_damage: 'illusion_damage_in_pct'        
    },
    phantom_lancer_spirit_lance: {
        hero: 'phantom_lancer',
        displayName: 'Phantom Lancer Spirit Lance',
        use_selected_hero: false,
        max_level: 4,
        outgoing_damage: 'illusion_damage_out_pct',
        incoming_damage: 'illusion_damage_in_pct'        
    },
    shadow_demon_disruption: {
        hero: 'shadow_demon',
        displayName: 'Shadow Demon Disruption',
        use_selected_hero: true,
        max_level: 4,
        outgoing_damage: 'illusion_outgoing_damage',
        incoming_damage: 'illusion_incoming_damage'        
    },
    spectre_haunt: {
        hero: 'spectre',
        displayName: 'Spectre Haunt',
        use_selected_hero: false,
        max_level: 3,
        outgoing_damage: 'illusion_damage_outgoing',
        incoming_damage: 'illusion_damage_incoming'        
    },
    terrorblade_conjure_image: {
        hero: 'terrorblade',
        displayName: 'Terrorblade Conjure Image',
        use_selected_hero: false,
        max_level: 4,
        outgoing_damage: 'illusion_outgoing_damage',
        incoming_damage: 'illusion_incoming_damage'        
    },
    terrorblade_reflection: {
        hero: 'terrorblade',
        displayName: 'Terrorblade Reflection',
        use_selected_hero: true,
        max_level: 4,
        outgoing_damage: 'illusion_outgoing_damage'     
    },
    item_manta: {
        hero: '',
        is_item: true,
        displayName: 'Manta Style Illusion',
        use_selected_hero: true,
        max_level: 1,
        outgoing_damage_melee: 'images_do_damage_percent_melee',
        incoming_damage_melee: 'images_take_damage_percent_melee',
        outgoing_damage_ranged: 'images_do_damage_percent_ranged',
        incoming_damage_ranged: 'images_take_damage_percent_ranged'
    }
}

module.exports = illusionData;
},{}],21:[function(require,module,exports){
var stackableItems = require("./stackableItems");
var levelItems = require("./levelItems");
var itemsWithActive = require("./itemsWithActive");

var BasicInventoryViewModel = function (h) {
    var self = this;
    self.items = ko.observableArray([]);
    self.activeItems = ko.observableArray([]);
    self.addItem = function (data, event) {
        if (data.selectedItem() != undefined) {
            var new_item = {
                item: data.selectedItem().split('|')[0],
                state: ko.observable(0),
                size: data.itemInputValue(),
                enabled: ko.observable(true)
            }
            switch (new_item.item) {
                case 'dagon':
                    new_item.size = Math.min(new_item.size, 5);
                break;
                break;
                case 'travel_boots':
                case 'diffusal_blade':
                    new_item.size = Math.min(new_item.size, 2);
                break;
                case 'necronomicon':
                    new_item.size = Math.min(new_item.size, 3);
                break;
            }
            this.items.push(new_item);
            if (data.selectedItem() === 'ring_of_aquila' || data.selectedItem() === 'ring_of_basilius' || data.selectedItem() === 'heart') {
                this.toggleItem(undefined, new_item, undefined);
            }
        }
    }.bind(this);
    self.toggleItem = function (index, data, event) {
        if (itemsWithActive.indexOf(data.item) >= 0) {
            if (this.activeItems.indexOf(data) < 0) {
                this.activeItems.push(data);
            }
            else {
                this.activeItems.remove(data);
            }
            switch (data.item) {
                case 'power_treads':
                    if (data.state() < 2) {
                        data.state(data.state() + 1);
                    }
                    else {
                        data.state(0);
                    }                
                break;
                default:
                    if (data.state() == 0) {
                        data.state(1);
                    }
                    else {
                        data.state(0);
                    }                
                break;
            }
        }
    }.bind(this);
    self.removeItem = function (item) {
        this.activeItems.remove(item);
        this.items.remove(item);
    }.bind(this);
    self.toggleMuteItem = function (item) {
        item.enabled(!item.enabled());
    }.bind(this);
    self.removeAll = function () {
        this.activeItems.removeAll();
        this.items.removeAll();
    }.bind(this);
}
BasicInventoryViewModel.prototype.getItemImage = function (data) {
    var state = ko.utils.unwrapObservable(data.state);
    switch (data.item) {
        case 'power_treads':
            if (state == 0) {
                return '/media/images/items/' + data.item + '_str.png';
            }
            else if (state == 1) {
                return '/media/images/items/' + data.item + '_int.png';
            }
            else {
                return '/media/images/items/' + data.item + '_agi.png';
            }
        break;
        case 'tranquil_boots':
        case 'ring_of_basilius':
            if (state == 0) {
                return '/media/images/items/' + data.item + '.png';
            }
            else {
                return '/media/images/items/' + data.item + '_active.png';
            }
        break;
        case 'armlet':
            if (state == 0) {
                return '/media/images/items/' + data.item + '.png';
            }
            else {
                return '/media/images/items/' + data.item + '_active.png';
            }
        break;
        case 'ring_of_aquila':
            if (state == 0) {
                return '/media/images/items/' + data.item + '_active.png';
            }
            else {
                return '/media/images/items/' + data.item + '.png';
            }
        break;
        case 'dagon':
        case 'diffusal_blade':
        case 'travel_boots':
        case 'necronomicon':
            if (data.size > 1) {
                return '/media/images/items/' + data.item + '_' + data.size + '.png';
            }
            else {
                return '/media/images/items/' + data.item + '.png';
            }
        break;
        default:
            return '/media/images/items/' + data.item + '.png';            
        break;
    }
};
BasicInventoryViewModel.prototype.getItemSizeLabel = function (data) {
    if (stackableItems.indexOf(data.item) != -1) {
        return '<span style="font-size:10px">Qty: </span>' + data.size;
    }
    else if (levelItems.indexOf(data.item) != -1) {
        return '<span style="font-size:10px">Lvl: </span>' + data.size;
    }
    else if (data.item == 'bloodstone') {
        return '<span style="font-size:10px">Charges: </span>' + data.size;
    }
    else {
        return '';
    }
};
BasicInventoryViewModel.prototype.getActiveBorder = function (data) {
    switch (data.item) {
        case 'power_treads':
        case 'tranquil_boots':
        case 'ring_of_basilius':
        case 'ring_of_aquila':
        case 'armlet':
            return 0;
        break;
        default:
            return ko.utils.unwrapObservable(data.state);    
        break;
    }
}
BasicInventoryViewModel.prototype.getItemAttributeValue = function (attributes, attributeName, level) {
    for (var i = 0; i < attributes.length; i++) {
        if (attributes[i].name == attributeName) {
            if (level == 0) {
                return parseFloat(attributes[i].value[0]);
            }
            else if (level > attributes[i].value.length) {
                return parseFloat(attributes[i].value[0]);
            }
            else {
                return parseFloat(attributes[i].value[level - 1]);
            }
        }
    }
}

module.exports = BasicInventoryViewModel;
},{"./itemsWithActive":27,"./levelItems":28,"./stackableItems":29}],22:[function(require,module,exports){
'use strict';
var ko = require('../herocalc_knockout');

var stackableItems = require("./stackableItems");
var levelItems = require("./levelItems");
var BasicInventoryViewModel = require("./BasicInventoryViewModel");
var itemOptionsArray = require("./itemOptionsArray");
var itemBuffOptions = require("./itemBuffOptions");
var itemDebuffOptions = require("./itemDebuffOptions");

var InventoryViewModel = function (itemData, h) {
    var self = this;
    BasicInventoryViewModel.call(this, h);
    self.hero = h;
    self.hasInventory = ko.observable(true);
    self.items = ko.observableArray([]);
    self.activeItems = ko.observableArray([]);
    self.hasScepter = ko.computed(function () {
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            if (item === 'ultimate_scepter' && self.items()[i].enabled()) {
                return true;
            }
            
        }
        return false;
    }, this);
    self.isEthereal = ko.computed(function () {
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if ((item === 'ghost' || item === 'ethereal_blade') && self.items()[i].enabled() && isActive) {
                return true;
            }
        }
        return false;
    }, this);
    self.isSheeped = ko.computed(function () {
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (item === 'sheepstick' && self.items()[i].enabled() && isActive) {
                return true;
            }
        }
        return false;
    }, this);
    self.totalCost = ko.computed(function () {
        var c = 0;
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            if (!self.items()[i].enabled()) continue;
            if (stackableItems.indexOf(item) != -1) {
                c += itemData['item_' + item].itemcost * self.items()[i].size;
            }
            else if (levelItems.indexOf(item) != -1) {
                switch(item) {
                    case 'diffusal_blade':
                        c += itemData['item_' + item].itemcost + (self.items()[i].size - 1) * 700;
                    break;
                    case 'necronomicon':
                    case 'dagon':
                        c += itemData['item_' + item].itemcost + (self.items()[i].size - 1) * 1250;
                    break;
                    default:
                        c += itemData['item_' + item].itemcost;
                    break;
                }
            }
            else {
                c += itemData['item_' + item].itemcost;
            }
            
        }
        return c;
    }, this);
    self.addItemBuff = function (data, event) {
        if (self.hasInventory() && self.selectedItemBuff() != undefined) {
            var new_item = {
                item: self.selectedItemBuff(),
                state: ko.observable(0),
                size: 1,
                enabled: ko.observable(true)
            }
            self.items.push(new_item);
            if (self.selectedItemBuff() === 'ring_of_aquila' || self.selectedItemBuff() === 'ring_of_basilius') {
                self.toggleItem(undefined, new_item, undefined);
            }
        }
    };
    self.addItemDebuff = function (data, event) {
        if (self.hasInventory() && self.selectedItemDebuff() != undefined) {
            var new_item = {
                item: self.selectedItemDebuff().split('|')[0],
                state: ko.observable(0),
                size: 1,
                enabled: ko.observable(true)
            }
            if (self.selectedItemDebuff().split('|').length == 2) {
                new_item.debuff = self.selectedItemDebuff().split('|')[1]
            }
            self.items.push(new_item);
            if (self.selectedItemDebuff() === 'ring_of_aquila' || self.selectedItemDebuff() === 'ring_of_basilius') {
                self.toggleItem(undefined, new_item, undefined);
            }
        }
    };
    
    self.getAttributes = function (attributetype) {
        var totalAttribute = 0;
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            var size = self.items()[i].size;
            for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                switch(attribute.name) {
                    case 'bonus_all_stats':
                        totalAttribute += parseInt(attribute.value[0]);
                    break;
                    case 'bonus_stats':
                        totalAttribute += parseInt(attribute.value[0]);
                    break;
                }
                switch(attributetype) {
                    case 'agi':
                        if (attribute.name == 'bonus_agility') {
                            if (item == 'diffusal_blade') {
                                totalAttribute += parseInt(attribute.value[size-1]);
                            }
                            else {
                                totalAttribute += parseInt(attribute.value[0]);
                            }
                        }
                        if (attribute.name == 'bonus_stat' && self.items()[i].state() == 2) {totalAttribute += parseInt(attribute.value[0]);};
                        if (attribute.name == 'bonus_agi') {totalAttribute += parseInt(attribute.value[0]);};
                    break;
                    case 'int':
                        if (attribute.name == 'bonus_intellect') {
                            if (item == 'necronomicon') {
                                totalAttribute += parseInt(attribute.value[size-1]);
                            }
                            else if (item == 'diffusal_blade') {
                                totalAttribute += parseInt(attribute.value[size-1]);
                            }
                            else if (item == 'dagon') {
                                totalAttribute += parseInt(attribute.value[size-1]);
                            }
                            else {
                                totalAttribute += parseInt(attribute.value[0]);
                            }
                        }
                        if (attribute.name == 'bonus_intelligence') {totalAttribute += parseInt(attribute.value[0]);};
                        if (attribute.name == 'bonus_int') {totalAttribute += parseInt(attribute.value[0]);};
                        if (attribute.name == 'bonus_stat' && self.items()[i].state() == 1) {totalAttribute += parseInt(attribute.value[0]);};
                    break;
                    case 'str':
                        if (attribute.name == 'bonus_strength') {
                            if (item == 'necronomicon') {
                                totalAttribute += parseInt(attribute.value[size-1]);
                            }
                            else {
                                totalAttribute += parseInt(attribute.value[0]);
                            }
                        }
                        if (attribute.name == 'bonus_stat' && self.items()[i].state() == 0) {totalAttribute += parseInt(attribute.value[0]);};
                        if (attribute.name == 'bonus_str') {totalAttribute += parseInt(attribute.value[0]);};
                        if (attribute.name == 'unholy_bonus_strength' && isActive) {totalAttribute += parseInt(attribute.value[0]);};
                    break;
                }
            }
        }
        return totalAttribute;
    };
    self.getBash = function (attacktype) {
        var totalAttribute = 1;
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                switch(attribute.name) {
                    case 'bash_chance':
                        totalAttribute *= (1 - parseInt(attribute.value[0]) / 100);
                    break;
                    case 'bash_chance_melee':
                        if (attacktype == 'DOTA_UNIT_CAP_MELEE_ATTACK') { totalAttribute *= (1 - parseInt(attribute.value[0]) / 100); };
                    break;
                    case 'bash_chance_ranged':
                        if (attacktype == 'DOTA_UNIT_CAP_RANGED_ATTACK') { totalAttribute *= (1 - parseInt(attribute.value[0]) / 100); };
                    break;
                }
            }
        }
        return totalAttribute;
    };
    
    self.getCritChance = function () {
        var totalAttribute = 1;
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                switch(attribute.name) {
                    case 'crit_chance':
                        totalAttribute *= (1 - parseInt(attribute.value[0]) / 100);
                    break;
                }
            }
        }
        return totalAttribute;
    };
    
    self.getCritSource = function () {
        var sources = {};
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            switch (item) {
                case 'lesser_crit':
                case 'greater_crit':
                case 'bloodthorn':
                    if (sources[item] == undefined) {
                        sources[item] = {
                            'chance': self.getItemAttributeValue(itemData['item_' + item].attributes, 'crit_chance', 0) / 100,
                            'multiplier': self.getItemAttributeValue(itemData['item_' + item].attributes, 'crit_multiplier', 0) / 100,
                            'count': 1,
                            'displayname': itemData['item_' + item].displayname
                        }
                    }
                    else {
                        sources[item].count += 1;
                    }
                break;
            }
            if (item === 'bloodthorn' && isActive) {
                if (sources['soul_rend'] == undefined) {
                    sources['soul_rend'] = {
                        'chance': 1,
                        'multiplier': self.getItemAttributeValue(itemData['item_' + item].attributes, 'target_crit_multiplier', 0) / 100,
                        'count': 1,
                        'displayname': 'Soul Rend'
                    }
                }
                else {
                    sources['soul_rend'].count += 1;
                }
            }
        }
        return sources;
    };

    self.getCleaveSource = function () {
        var sources = {};
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            switch (item) {
                case 'bfury':
                    if (sources[item] == undefined) {
                        sources[item] = {
                            'radius': self.getItemAttributeValue(itemData['item_' + item].attributes, 'cleave_radius', 0),
                            'magnitude': self.getItemAttributeValue(itemData['item_' + item].attributes, 'cleave_damage_percent', 0) / 100,
                            'count': 1,
                            'displayname': itemData['item_' + item].displayname
                        }
                    }
                    else {
                        sources[item].count += 1;
                    }
                break;
            }

        }
        return sources;
    };
    
    self.getBashSource = function (attacktype) {
        var sources = {};
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            switch (item) {
                case 'javelin':
                    if (sources[item] == undefined) {
                        sources[item] = {
                            'damage': self.getItemAttributeValue(itemData['item_' + item].attributes, 'bonus_chance_damage', 1),
                            'damageType': 'magic',
                            'count': 1,
                            'chance': self.getItemAttributeValue(itemData['item_' + item].attributes, 'bonus_chance', 1) / 100,
                            'displayname': itemData['item_' + item].displayname + ' Pierce'
                        }
                    }
                    else {
                        sources[item].count += 1;
                    }
                break;
                case 'monkey_king_bar':
                    if (sources[item] == undefined) {
                        sources[item] = {
                            'item': item,
                            'chance': self.getItemAttributeValue(itemData['item_' + item].attributes, 'bash_chance', 0) / 100,
                            'damage': self.getItemAttributeValue(itemData['item_' + item].attributes, 'bash_damage', 0),
                            'duration': self.getItemAttributeValue(itemData['item_' + item].attributes, 'bash_stun', 0),
                            'count': 1,
                            'damageType': 'magic',
                            'displayname': 'Mini-Bash' //itemData['item_' + item].displayname
                        }
                    }
                    else {
                        sources[item].count += 1;
                    }
                break;
                case 'abyssal_blade':
                case 'basher':
                    if (!sources.hasOwnProperty('bash')) {
                        sources['bash'] = {
                            'item': item,
                            'chance': self.getItemAttributeValue(itemData['item_' + item].attributes, (attacktype == 'DOTA_UNIT_CAP_MELEE_ATTACK') ?'bash_chance_melee' : 'bash_chance_ranged', 0) / 100,
                            'damage': self.getItemAttributeValue(itemData['item_' + item].attributes, 'bonus_chance_damage', 0),
                            'duration': self.getItemAttributeValue(itemData['item_' + item].attributes, 'bash_duration', 0),
                            'count': 1,
                            'damageType': 'physical',
                            'displayname': 'Bash' //itemData['item_' + item].displayname
                        }
                    }
                    else {
                        //sources[item].count += 1;
                    }
                break;
            }

        }
        return sources;
    };
    
    self.getOrbProcSource = function () {
        var sources = {};
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            switch (item) {
                case 'maelstrom':
                case 'mjollnir':
                    if (sources[item] == undefined) {
                        sources[item] = {
                            'chance': self.getItemAttributeValue(itemData['item_' + item].attributes, 'chain_chance', 0) / 100,
                            'damage': self.getItemAttributeValue(itemData['item_' + item].attributes, 'chain_damage', 0),
                            'count': 1,
                            'damageType': 'magic',
                            'displayname': itemData['item_' + item].displayname
                        }
                    }
                    else {
                        sources[item].count += 1;
                    }
                break;
            }

        }
        return sources;
    };

    self.getOrbSource = function () {
        var sources = {};
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            switch (item) {
                case 'diffusal_blade':
                    if (sources[item] == undefined) {
                        sources[item] = {
                            'chance': 1,
                            'damage': self.getItemAttributeValue(itemData['item_' + item].attributes, 'feedback_mana_burn', self.items()[i].size),
                            'count': 1,
                            'damageType': 'physical',
                            'displayname': itemData['item_' + item].displayname
                        }
                    }
                    else {
                        sources[item].count += 1;
                    }
                break;
            }

        }
        return sources;
    };
    
    self.getHealth = function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                switch(attribute.name) {
                    case 'bonus_health':
                        totalAttribute += parseInt(attribute.value[0]);
                    break;
                }
            }
        }
        return totalAttribute;
    };
    self.getHealthRegen = function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                switch(attribute.name) {
                    case 'health_regen':
                    case 'bonus_regen':
                        totalAttribute += parseInt(attribute.value[0]);
                    break;
                    case 'bonus_health_regen':
                        if (item == 'tranquil_boots' && !isActive) {
                            totalAttribute += parseInt(attribute.value[0]);
                        }
                        else if (item != 'tranquil_boots') {
                            totalAttribute += parseInt(attribute.value[0]);
                        }
                    break;
                    case 'hp_regen':
                        totalAttribute += parseInt(attribute.value[0]);
                    break;
                    case 'health_regen_rate':
                        if (item == 'heart' && isActive) {
                            totalAttribute += (parseInt(attribute.value[0]) / 100) * self.hero.health();
                        }
                    break;
                }
            }
        }
        return totalAttribute;
    };
    self.getHealthRegenAura = function (e) {
        var totalAttribute = 0,
            excludeList = e || [];
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                if (excludeList.indexOf(item + attribute.name) > -1) continue;
                switch(attribute.name) {
                    case 'aura_health_regen':
                        totalAttribute += parseInt(attribute.value[0]);
                        excludeList.push(item + attribute.name);
                    break;
                }
            }
        }
        return {value: totalAttribute, excludeList: excludeList};
    };
    
    self.getMana = function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                switch(attribute.name) {
                    case 'bonus_mana':
                        totalAttribute += parseInt(attribute.value[0]);
                    break;
                }
            }
        }
        return totalAttribute;
    };
    
    self.getManaRegen = function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                switch(attribute.name) {
                    case 'aura_mana_regen':
                    case 'mana_regen_aura':
                        totalAttribute += parseFloat(attribute.value[0]);
                    break;
                    case 'mana_regen':
                        if (item == 'infused_raindrop') totalAttribute += parseFloat(attribute.value[0]);
                    break;
                }
            }
        }
        return totalAttribute;    
    };
    self.getManaRegenPercent = function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                switch(attribute.name) {
                    case 'bonus_mana_regen':
                    case 'mana_regen':
                    case 'bonus_mana_regen_pct':
                        if (item != 'infused_raindrop') totalAttribute += parseFloat(attribute.value[0]);
                    break;
                }
            }
        }
        return totalAttribute / 100;    
    };
    self.getManaRegenBloodstone = function () {
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            if (!self.items()[i].enabled()) continue;
            if (item.indexOf('bloodstone') != -1) {
                return parseInt(self.items()[i].size);
            }
        }
        return 0;
    };
    
    self.getArmor = function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                switch(attribute.name) {
                    case 'bonus_armor':
                        if (!isActive || (item != 'medallion_of_courage' && item != 'solar_crest')) { totalAttribute += parseInt(attribute.value[0]); };
                    break;
                    case 'unholy_bonus_armor':
                        if (isActive && item == 'armlet') { totalAttribute += parseInt(attribute.value[0]); };
                    break;
                }
            }
        }
        return totalAttribute;
    };
    
    self.getArmorAura = function (aList) {
        var totalAttribute = 0,
            attributeList = aList || [];
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0;j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                if (attributeList.find(function (a) { return attribute.name == a.name; })) continue;
                switch(attribute.name) {
                    // buckler
                    case 'bonus_aoe_armor':
                        if (isActive) {
                            attributeList.push({'name':attribute.name, 'value': parseInt(attribute.value[0])});
                        }
                    break;
                    // assault
                    case 'aura_positive_armor':
                        attributeList.push({'name':attribute.name, 'value': parseInt(attribute.value[0])});
                    break;
                    // ring_of_aquila,ring_of_basilius
                    case 'aura_bonus_armor':
                        if (isActive) {
                            attributeList.push({'name':attribute.name, 'value': parseInt(attribute.value[0])});
                        }
                    break;
                    // vladmir
                    case 'armor_aura':
                        attributeList.push({'name':attribute.name, 'value': parseInt(attribute.value[0])});
                    break;
                    // mekansm
                    case 'heal_bonus_armor':
                        if (isActive) {
                            attributeList.push({'name':attribute.name, 'value': parseInt(attribute.value[0])});
                        }
                    break;
                }
            }
        }
        // remove buckler if there is a mekansm
        if (attributeList.find(function (attribute) { return attribute.name == 'heal_bonus_armor'; })) {
            attributeList = attributeList.filter(function (attribute) {
                return attribute.name !== 'bonus_aoe_armor';
            });
        }
        // remove ring_of_aquila,ring_of_basilius if there is a vladmir
        if (attributeList.find(function (attribute) { return attribute.name == 'armor_aura'; })) {
            attributeList = attributeList.filter(function (attribute) {
                return attribute.name !== 'aura_bonus_armor';
            });
        }
        
        totalAttribute = attributeList.reduce(function (memo, attribute) {
            return memo += attribute.value;
        }, 0);
        return {value: totalAttribute, attributes: attributeList};
    };
    self.getArmorReduction = function (e) {
        var totalAttribute = 0,
            excludeList = e || [];
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                if (excludeList.indexOf(attribute.name) > -1 || excludeList.indexOf(item + '_' + attribute.name) > -1) continue;
                switch(attribute.name) {
                    case 'armor_reduction':
                        if (isActive || (item != 'medallion_of_courage' && item != 'solar_crest')) {
                            totalAttribute += parseInt(attribute.value[0]);
                            excludeList.push(item + '_' + attribute.name);
                        }
                    break;
                    case 'aura_negative_armor':
                        totalAttribute += parseInt(attribute.value[0]);
                        excludeList.push(attribute.name);
                    break;
                    case 'corruption_armor':
                        totalAttribute += parseInt(attribute.value[0]);
                        excludeList.push(attribute.name);
                    break;
                }
            }
        }
        return {value: totalAttribute, excludeList: excludeList};
    };
    self.getEvasion = function () {
        var totalAttribute = 1;
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                switch(attribute.name) {
                    case 'bonus_evasion':
                        if (!isActive || (item != 'butterfly' && item != 'solar_crest')) { totalAttribute *= (1 - parseInt(attribute.value[0]) / 100); }
                    break;
                }
            }
        }
        return totalAttribute;
    };
    self.getMovementSpeedFlat = function () {
        var totalAttribute = 0,
        hasBoots = false,
        hasEuls = false,
        hasWindLace = false,
        bootItems = ['boots','phase_boots','arcane_boots','travel_boots','power_treads','tranquil_boots','guardian_greaves'];
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                switch(attribute.name) {
                    case 'bonus_movement_speed':
                        if (!hasBoots && bootItems.indexOf(item) >= 0) {
                            if (item != 'tranquil_boots' || (item == 'tranquil_boots' && !isActive)) {
                                totalAttribute += parseInt(attribute.value[0]);
                                hasBoots = true;
                            }
                        }
                        //else if (!hasEuls && item == 'cyclone') {
                        else if (item == 'cyclone') {
                            totalAttribute += parseInt(attribute.value[0]);
                            hasEuls = true;
                        }
                    break;
                    case 'broken_movement_speed':
                        if (!hasBoots && bootItems.indexOf(item) >= 0) {
                            if (item == 'tranquil_boots' && isActive) {
                                totalAttribute += parseInt(attribute.value[0]);
                                hasBoots = true;
                            }
                        }
                    break;
                    case 'bonus_movement':
                        if (!hasBoots && bootItems.indexOf(item) >= 0) {
                            totalAttribute += parseInt(attribute.value[0]);
                            hasBoots = true;
                        }
                    break;
                    case 'movement_speed':
                        if (!hasWindLace && item == 'wind_lace') {
                            totalAttribute += parseInt(attribute.value[0]);
                            hasWindLace = true;
                        }
                    break;
                }
            }
        }
        return totalAttribute;
    };
    self.getMovementSpeedPercent = function (e) {
        var totalAttribute = 0,
            excludeList = e || [],
            hasYasha = false,
            hasDrums = false,
            hasDrumsActive = false,
            hasPhaseActive = false,
            hasShadowBladeActive = false,
            hasButterflyActive = false,
            hasMoMActive = false,
            yashaItems = ['manta','yasha','sange_and_yasha'];
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                if (excludeList.indexOf(attribute.name) > -1) continue;
                switch(attribute.name) {
                    case 'movement_speed_percent_bonus':
                        if (!hasYasha && yashaItems.indexOf(item) >= 0) {
                            totalAttribute += parseInt(attribute.value[0]);
                            hasYasha = true;
                        }
                    break;
                    case 'bonus_aura_movement_speed_pct':
                        if (!hasDrums && item == 'ancient_janggo') {
                            totalAttribute += parseInt(attribute.value[0]);
                            hasDrums = true;
                            excludeList.push(attribute.name);
                        }
                    break;
                    case 'phase_movement_speed':
                        if (isActive && !hasPhaseActive) {
                            totalAttribute += parseInt(attribute.value[0]);
                            hasPhaseActive = true;
                        }
                    break;
                    case 'bonus_movement_speed_pct':
                        if (isActive && !hasDrumsActive && item == 'ancient_janggo') {
                            totalAttribute += parseInt(attribute.value[0]);
                            hasDrumsActive = true;
                            excludeList.push(attribute.name);
                        }
                    break;
                    case 'windwalk_movement_speed':
                        if (isActive && !hasShadowBladeActive && (item == 'invis_sword' || item == 'silver_edge')) {
                            totalAttribute += parseInt(attribute.value[0]);
                            hasShadowBladeActive = true;
                        }
                    break;
                    case 'berserk_bonus_movement_speed':
                        if (isActive && !hasMoMActive && item == 'mask_of_madness') {
                            totalAttribute += parseInt(attribute.value[0]);
                            hasMoMActive = true;
                        }
                    break;
                    case 'bonus_movement_speed': //manta
                        if (!hasYasha && item == 'manta') {
                            totalAttribute += parseInt(attribute.value[0]);
                            hasYasha = true;
                        }
                        else if (item == 'smoke_of_deceit' && isActive) {
                            totalAttribute += parseInt(attribute.value[0]);
                        }
                    break;
                    case 'bonus_move_speed':
                        if (isActive && !hasButterflyActive && item == 'butterfly') {
                            totalAttribute += parseInt(attribute.value[0]);
                            hasButterflyActive = true;
                        }
                    break;
                }
            }
        }
        return {value: totalAttribute/100, excludeList: excludeList};
    };
    
    self.getMovementSpeedPercentReduction = function (e) {
        var totalAttribute = 0,
            excludeList = e || [];
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                if (excludeList.indexOf(attribute.name) > -1) continue;
                switch(attribute.name) {
                    case 'movespeed':
                        if (item == 'dust' && isActive) {
                            totalAttribute += parseInt(attribute.value[0]);
                        }
                    case 'blast_movement_speed':
                        if (item == 'shivas_guard' && isActive) {
                            totalAttribute += parseInt(attribute.value[0]);
                            excludeList.push(attribute.name);
                        }
                    case 'cold_movement_speed':
                        if (item == 'skadi') {
                            totalAttribute += parseInt(attribute.value[0]);
                        }
                    break;
                    case 'maim_movement_speed':
                        if (self.items()[i].debuff && self.items()[i].debuff == 'maim') {
                            totalAttribute += parseInt(attribute.value[0]);
                            excludeList.push(attribute.name);
                        }
                    break;
                }
            }
        }
        return {value: totalAttribute/100, excludeList: excludeList};
    };
    
    self.getBonusDamage = function () {
        var totalAttribute = 0;
        var sources = {};
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                switch(attribute.name) {
                    case 'bonus_damage':
                        totalAttribute += parseInt(attribute.value[0]);
                        if (sources[item] == undefined) {
                            sources[item] = {
                                'damage': parseInt(attribute.value[0]),
                                'damageType': 'physical',
                                'count':1,
                                'displayname': itemData['item_' + item].displayname
                            }                            
                        }
                        else {
                            sources[item].count += 1;
                        }
                    break;
                    case 'unholy_bonus_damage':
                        if (isActive) {
                            totalAttribute += parseInt(attribute.value[0]);
                            if (sources[item + '_active'] == undefined) {
                                sources[item + '_active'] = {
                                    'damage': parseInt(attribute.value[0]),
                                    'damageType': 'physical',
                                    'count':1,
                                    'displayname': itemData['item_' + item].displayname + ' Unholy Strength'
                                }                            
                            }
                            else {
                                sources[item].count += 1;
                            }
                        }
                    break;
                }
            }
        }
        return { sources: sources, total: totalAttribute };
    };
    self.getBonusDamagePercent = function (s) {
        s = s || {sources:{},total:0};
        var totalAttribute = s.total || 0;
        var sources = s.sources || {};
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                switch(attribute.name) {
                    case 'damage_aura':
                        if (sources[item] == undefined) {
                            totalAttribute += parseInt(attribute.value[0]) / 100;
                            sources[item] = {
                                'damage': parseInt(attribute.value[0]) / 100,
                                'damageType': 'physical',
                                'count':1,
                                'displayname': itemData['item_' + item].displayname
                            }
                        }
                        // else {
                            // sources[item].count += 1;
                        // }
                    break;
                }
            }
        }
        return { sources: sources, total: totalAttribute };
    };
    self.getAttackSpeed = function (e) {
        var totalAttribute = 0,
            hasPowerTreads = false,
            excludeList = e || [];
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                if (excludeList.indexOf(attribute.name) > -1) continue;
                switch(attribute.name) {
                    case 'bonus_attack_speed':
                        if (item == 'power_treads') {
                            if (!hasPowerTreads) {
                                totalAttribute += parseInt(attribute.value[0]);
                                hasPowerTreads = true;
                            }
                        }
                        else if (item == 'moon_shard') {
                            if (!isActive) {
                                totalAttribute += parseInt(attribute.value[0]);
                            }
                        }
                        else if (item == 'hurricane_pike') {
                            if (isActive) {
                                totalAttribute += parseInt(attribute.value[0]);
                            }
                        }
                        else {
                            totalAttribute += parseInt(attribute.value[0]);
                        }
                    break;
                    case 'consumed_bonus':
                        if (item == 'moon_shard' && isActive) {
                            totalAttribute += parseInt(attribute.value[0]);
                        }
                    break;
                    break;
                    case 'bonus_speed':
                        totalAttribute += parseInt(attribute.value[0]);
                    break;
                    case 'aura_attack_speed':
                        if (item != 'shivas_guard') { totalAttribute += parseInt(attribute.value[0]); };
                    break;
                    // ancient_janggo
                    case 'bonus_aura_attack_speed_pct':
                        totalAttribute += parseInt(attribute.value[0]);
                        excludeList.push(attribute.name);
                    break;
                    // ancient_janggo
                    case 'bonus_attack_speed_pct':
                        if (isActive) {
                            totalAttribute += parseInt(attribute.value[0]);
                            excludeList.push(attribute.name);
                        }
                    break;
                    case 'unholy_bonus_attack_speed':
                        if (isActive) { totalAttribute += parseInt(attribute.value[0]); };
                    break;
                    case 'berserk_bonus_attack_speed':
                        if (isActive) { totalAttribute += parseInt(attribute.value[0]); };
                    break;
                }
            }
        }
        return {value: totalAttribute, excludeList: excludeList};
    };
    self.getAttackSpeedReduction = function (e) {
        var totalAttribute = 0,
            excludeList = e || [];
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                if (excludeList.indexOf(attribute.name) > -1) continue;
                switch(attribute.name) {
                    case 'aura_attack_speed':
                        if (item == 'shivas_guard') {
                            totalAttribute += parseInt(attribute.value[0]);
                            excludeList.push(attribute.name);
                        }
                    break;
                    case 'cold_attack_speed':
                        if (item == 'skadi') {
                            totalAttribute += parseInt(attribute.value[0]);
                            excludeList.push(attribute.name);
                        }
                    break;
                    case 'maim_attack_speed':
                        if (self.items()[i].debuff && self.items()[i].debuff == 'maim') {
                            totalAttribute += parseInt(attribute.value[0]);
                            excludeList.push(attribute.name);
                        }
                    break;
                }
            }
        }
        return {value: totalAttribute, excludeList: excludeList};
    };
    self.getLifesteal = function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                switch(attribute.name) {
                    case 'lifesteal_percent':
                        if (item == 'satanic') {
                            if (!isActive) { return parseInt(attribute.value[0]); };
                        }
                        else {
                            return parseInt(attribute.value[0]);
                        }
                    break;
                    case 'unholy_lifesteal_percent':
                        if (isActive) { return parseInt(attribute.value[0]); };
                    break;
                }
            }
        }
        return totalAttribute;
    };
    self.getLifestealAura = function (e) {
        var totalAttribute = 0,
            excludeList = e || [];
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                if (excludeList.indexOf(attribute.name) > -1) continue;
                switch(attribute.name) {
                    case 'vampiric_aura':
                        totalAttribute += parseInt(attribute.value[0]);
                        excludeList.push(attribute.name);
                    break;
                }
            }
        }
        return {value: totalAttribute, excludeList: excludeList};
    };
    self.getMagicResist = function () {
        var totalAttribute = 1;
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                switch(attribute.name) {
                    case 'bonus_magical_armor':
                        totalAttribute *= (1 - parseInt(attribute.value[0]) / 100);
                    break;
                    case 'bonus_spell_resist':
                        totalAttribute *= (1 - parseInt(attribute.value[0]) / 100);
                    break;
                    case 'magic_resistance':
                        totalAttribute *= (1 - parseInt(attribute.value[0]) / 100);
                    break;
                }
            }
        }
        return totalAttribute;
    };
    self.getMagicResistReductionSelf = function () {
        var totalAttribute = 1;
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            if (isActive) {
                for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                    var attribute = itemData['item_' + item].attributes[j];
                    switch(attribute.name) {
                        case 'extra_spell_damage_percent':
                        case 'ethereal_damage_bonus':
                            return (1 - parseInt(attribute.value[0]) / 100);
                        break;
                    }
                }
            }
        }
        return totalAttribute;
    };   
    self.getMagicResistReduction = function () {
        var totalAttribute = 1;
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            if (isActive) {
                for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                    var attribute = itemData['item_' + item].attributes[j];
                    switch(attribute.name) {
                        case 'ethereal_damage_bonus':
                            if (!self.isEthereal()) totalAttribute *= (1 - parseInt(attribute.value[0]) / 100);
                        case 'resist_debuff':
                            totalAttribute *= (1 - parseInt(attribute.value[0]) / 100);
                        break;
                    }
                }
            }
        }
        return totalAttribute;
    };        

    self.getVisionRangeNight = ko.computed(function () {
        var totalAttribute = 0;
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                switch(attribute.name) {
                    case 'bonus_night_vision':
                        if (item != 'moon_shard' || !isActive) {
                            totalAttribute += parseInt(attribute.value[0]);
                        }
                    break;
                }
            }
        }
        return totalAttribute;
    });
    
    self.getAttackRange = function (attacktype, aList) {
        var totalAttribute = 0,
            attributeList = aList || [];
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0;j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                if (attributeList.find(function (a) { return attribute.name == a.name; })) continue;
                switch(attribute.name) {
                    // dragon_lance
                    case 'base_attack_range':
                        if (attacktype == 'DOTA_UNIT_CAP_RANGED_ATTACK') attributeList.push({'name':attribute.name, 'value': parseInt(attribute.value[0])});
                    break;
                }
            }
        }
        
        totalAttribute = attributeList.reduce(function (memo, attribute) {
            return memo += attribute.value;
        }, 0);
        return {value: totalAttribute, attributes: attributeList};
    };
    
    self.getMissChance = function (e) {
        var totalAttribute = 1,
            excludeList = e || [];
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                if (excludeList.indexOf(attribute.name) > -1) continue;
                switch(attribute.name) {
                    case 'miss_chance':
                        if (item === 'solar_crest' && isActive) {
                            totalAttribute *= (1 - parseInt(attribute.value[0]) / 100);
                            excludeList.push(attribute.name);
                        }
                    break;
                    case 'blind_pct':
                        totalAttribute *= (1 - parseInt(attribute.value[0]) / 100);
                        excludeList.push(attribute.name);
                    break;
                }
            }
        }
        return {value: totalAttribute, excludeList: excludeList};
    };
    
    self.getBaseDamageReductionPct = function () {
        var totalAttribute = 1;
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                switch(attribute.name) {
                    case 'backstab_reduction':
                        if (self.items()[i].debuff && self.items()[i].debuff == 'shadow_walk') {
                            totalAttribute *= (1 + parseInt(attribute.value[0]) / 100);
                        }
                    break;
                }
            }
        }
        return totalAttribute;
    };    
    self.getBonusDamageReductionPct = function () {
        var totalAttribute = 1;
        for (var i = 0; i < self.items().length; i++) {
            var item = self.items()[i].item;
            var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
            if (!self.items()[i].enabled()) continue;
            for (var j = 0; j < itemData['item_' + item].attributes.length; j++) {
                var attribute = itemData['item_' + item].attributes[j];
                switch(attribute.name) {
                    case 'backstab_reduction':
                        if (self.items()[i].debuff && self.items()[i].debuff == 'shadow_walk') {
                            totalAttribute *= (1 + parseInt(attribute.value[0]) / 100);
                        }
                    break;
                }
            }
        }
        return totalAttribute;
    };
    
    self.itemOptions = ko.observableArray(itemOptionsArray.items);
    
    self.itemBuffOptions = ko.observableArray(itemBuffOptions.items);
    self.selectedItemBuff = ko.observable('assault');

    self.itemDebuffOptions = ko.observableArray(itemDebuffOptions.items);
    self.selectedItemDebuff = ko.observable('assault');
    
    return self;
};
InventoryViewModel.prototype = Object.create(BasicInventoryViewModel.prototype);
InventoryViewModel.prototype.constructor = InventoryViewModel;

module.exports = InventoryViewModel;
},{"../herocalc_knockout":19,"./BasicInventoryViewModel":21,"./itemBuffOptions":24,"./itemDebuffOptions":25,"./itemOptionsArray":26,"./levelItems":28,"./stackableItems":29}],23:[function(require,module,exports){
var ItemInput = function (itemData, value, name, debuff) {
    if (itemData['item_' + value].ItemAliases instanceof Array) {
        var itemAlias = itemData['item_' + value].ItemAliases.join(' ');
    }
    else {
        var itemAlias = itemData['item_' + value].ItemAliases;
    }
    this.value = ko.observable(value);
    this.debuff = ko.observable(debuff);
    if (this.debuff()) {
        this.value = ko.observable(value + '|' + debuff.id);
        this.name = ko.observable(name + ' (' + debuff.name + ')');
        this.displayname = ko.observable(name + ' (' + debuff.name + ') <span style="display:none">' + ';' + itemAlias + '</span>');
    }
    else {
        this.value = ko.observable(value);
        this.name = ko.observable(name);
        this.displayname = ko.observable(name + ' <span style="display:none">' + ';' + itemAlias + '</span>');
    }
};

module.exports = ItemInput;
},{}],24:[function(require,module,exports){
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
},{"./ItemInput":23}],25:[function(require,module,exports){
var ItemInput = require("./ItemInput");
var itemDebuffs = [
    {item: 'assault', debuff: null},
    {item: 'shivas_guard', debuff: null},
    {item: 'desolator', debuff: null},
    {item: 'medallion_of_courage', debuff: null},
    {item: 'radiance', debuff: null},
    {item: 'sheepstick', debuff: null},
    {item: 'veil_of_discord', debuff: null},
    {item: 'solar_crest', debuff: null},
    {item: 'silver_edge', debuff: {id: 'shadow_walk', name: 'Shadow Walk'}},
    {item: 'silver_edge', debuff: {id: 'maim', name: 'Lesser Maim'}}
]
var itemDebuffOptions = {};

var init = function (itemData) {
    itemDebuffOptions.items = itemDebuffs.map(function(item) {
        return new ItemInput(itemData, item.item, itemData['item_' + item.item].displayname, item.debuff);
    });
    return itemDebuffOptions.items;
}

itemDebuffOptions.init = init;

module.exports = itemDebuffOptions;
},{"./ItemInput":23}],26:[function(require,module,exports){
var validItems = require("./validItems");
var ItemInput = require("./ItemInput");

var itemOptionsArray = {};

var init = function (itemData) {
    itemOptionsArray.items = [];
    for (var i = 0; i < validItems.length; i++) {
        itemOptionsArray.items.push(new ItemInput(itemData, validItems[i], itemData['item_' + validItems[i]].displayname));
    }
    return itemOptionsArray.items;
}

itemOptionsArray.init = init;

module.exports = itemOptionsArray;
},{"./ItemInput":23,"./validItems":30}],27:[function(require,module,exports){
module.exports = ['solar_crest', 'heart','smoke_of_deceit','dust','ghost','tranquil_boots','phase_boots','power_treads','buckler','medallion_of_courage','ancient_janggo','mekansm','pipe','veil_of_discord','rod_of_atos','orchid','sheepstick','armlet','invis_sword','ethereal_blade','shivas_guard','manta','mask_of_madness','diffusal_blade','mjollnir','satanic','ring_of_basilius','ring_of_aquila', 'butterfly', 'moon_shard', 'silver_edge','bloodthorn','hurricane_pike'];
},{}],28:[function(require,module,exports){
module.exports = ['necronomicon','dagon','diffusal_blade','travel_boots'];
},{}],29:[function(require,module,exports){
module.exports = ['clarity','flask','dust','ward_observer','ward_sentry','tango','tpscroll','smoke_of_deceit'];
},{}],30:[function(require,module,exports){
module.exports = ["abyssal_blade","ultimate_scepter","courier","arcane_boots","armlet","assault","boots_of_elves","bfury","belt_of_strength","black_king_bar","blade_mail","blade_of_alacrity","blades_of_attack","blink","bloodstone","boots","travel_boots","bottle","bracer","broadsword","buckler","butterfly","chainmail","circlet","clarity","claymore","cloak","lesser_crit","greater_crit","dagon","demon_edge","desolator","diffusal_blade","rapier","ancient_janggo","dust","eagle","energy_booster","ethereal_blade","cyclone","skadi","flying_courier","force_staff","gauntlets","gem","ghost","gloves","hand_of_midas","headdress","flask","heart","heavens_halberd","helm_of_iron_will","helm_of_the_dominator","hood_of_defiance","hyperstone","branches","javelin","sphere","maelstrom","magic_stick","magic_wand","manta","mantle","mask_of_madness","medallion_of_courage","mekansm","mithril_hammer","mjollnir","monkey_king_bar","lifesteal","mystic_staff","necronomicon","null_talisman","oblivion_staff","ward_observer","ogre_axe","orb_of_venom","orchid","pers","phase_boots","pipe","platemail","point_booster","poor_mans_shield","power_treads","quarterstaff","quelling_blade","radiance","reaver","refresher","ring_of_aquila","ring_of_basilius","ring_of_health","ring_of_protection","ring_of_regen","robe","rod_of_atos","relic","sobi_mask","sange","sange_and_yasha","satanic","sheepstick","ward_sentry","shadow_amulet","invis_sword","shivas_guard","basher","slippers","smoke_of_deceit","soul_booster","soul_ring","staff_of_wizardry","stout_shield","talisman_of_evasion","tango","tpscroll","tranquil_boots","ultimate_orb","urn_of_shadows","vanguard","veil_of_discord","vitality_booster","vladmir","void_stone","wraith_band","yasha","crimson_guard","enchanted_mango","lotus_orb","glimmer_cape","guardian_greaves","moon_shard","silver_edge","solar_crest","octarine_core","aether_lens","faerie_fire","iron_talon","dragon_lance","echo_sabre","infused_raindrop","blight_stone","wind_lace","tome_of_knowledge","bloodthorn","hurricane_pike"];
},{}],31:[function(require,module,exports){
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
        core.HeroOptions = require("./hero/heroOptionsArray").init(core.Data.heroData);
        core.BuffOptions = require("./buffs/buffOptionsArray").init(core.Data.heroData);
        core.DebuffOptions = require("./buffs/debuffOptionsArray").init(core.Data.heroData);
        core.ItemOptions = require("./inventory/itemOptionsArray").init(core.Data.itemData);
        core.ItemBuffOptions = require("./inventory/itemBuffOptions").init(core.Data.itemData);
        core.ItemDebuffOptions = require("./inventory/itemDebuffOptions").init(core.Data.itemData);
        callback();
    });
}

module.exports = core;
},{"./AbilityModel":1,"./BuffViewModel":2,"./buffs/buffOptionsArray":4,"./buffs/debuffOptionsArray":5,"./data/main":6,"./hero/CloneModel":7,"./hero/HeroModel":10,"./hero/IllusionModel":12,"./hero/UnitModel":13,"./hero/heroOptionsArray":15,"./inventory/InventoryViewModel":22,"./inventory/itemBuffOptions":24,"./inventory/itemDebuffOptions":25,"./inventory/itemOptionsArray":26,"./util/main":36}],32:[function(require,module,exports){
var extend = function (out) {
    out = out || {};

    for (var i = 1; i < arguments.length; i++) {
        var obj = arguments[i];

        if (!obj)
            continue;

        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] === 'object')
                    out[key] = extend(out[key], obj[key]);
                else
                    out[key] = obj[key];
            }
        }
    }

    return out;
};

module.exports = extend;
},{}],33:[function(require,module,exports){
var findWhere = function (arr, obj) {
    arrLoop: for (var i = 0; i < arr.length; i++) {
        objLoop: for (var key in obj) {
            if (arr[i][key] != obj[key]) {
                continue arrLoop;
            }
        }
        return arr[i];
    }
}

module.exports = findWhere;
},{}],34:[function(require,module,exports){
"use strict";

var getJSON = function (url, successCallback, errorCallback) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            // Success!
            var data = JSON.parse(request.responseText);
            successCallback(data);
        } else {
            // We reached our target server, but it returned an error
            errorCallback();
        }
    };

    request.onerror = function() {
        // There was a connection error of some sort
        errorCallback();
    };

    request.send();
}

module.exports = getJSON;
},{}],35:[function(require,module,exports){
var isEmpty = function (obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}

module.exports = isEmpty;
},{}],36:[function(require,module,exports){
'use strict';

var util = {};
util.extend = require("./extend");
util.findWhere = require("./findWhere");
util.getJSON = require("./getJSON");
util.union = require("./union");
util.uniqueId = require("./uniqueId");
util.uniques = require("./uniques");

module.exports = util;
},{"./extend":32,"./findWhere":33,"./getJSON":34,"./union":37,"./uniqueId":38,"./uniques":39}],37:[function(require,module,exports){
"use strict";
var uniques = require("./uniques");

var union = function (a, b) {
    var arr = a.concat(b);
    return uniques(arr);
}

module.exports = union;
},{"./uniques":39}],38:[function(require,module,exports){
"use strict";

var idCounter = 0;
var uniqueId = function (prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
};

module.exports = uniqueId;
},{}],39:[function(require,module,exports){
"use strict";
var uniques = function (arr) {
    var a = [];
    for (var i=0, l=arr.length; i<l; i++)
        if (a.indexOf(arr[i]) === -1 && arr[i] !== '')
            a.push(arr[i]);
    return a;
}

module.exports = uniques;
},{}],40:[function(require,module,exports){
(function (global){
(function (factory) {
	// Module systems magic dance.

	if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
		// CommonJS or Node: hard-coded dependency on "knockout"
		factory((typeof window !== "undefined" ? window['ko'] : typeof global !== "undefined" ? global['ko'] : null), exports);
	} else if (typeof define === "function" && define["amd"]) {
		// AMD anonymous module with hard-coded dependency on "knockout"
		define(["knockout", "exports"], factory);
	} else {
		// <script> tag: use the global `ko` object, attaching a `mapping` property
		factory(ko, ko.mapping = {});
	}
}(function (ko, exports) {
	var DEBUG=true;
	var mappingProperty = "__ko_mapping__";
	var realKoDependentObservable = ko.dependentObservable;
	var mappingNesting = 0;
	var dependentObservables;
	var visitedObjects;
	var recognizedRootProperties = ["create", "update", "key", "arrayChanged"];
	var emptyReturn = {};

	var _defaultOptions = {
		include: ["_destroy"],
		ignore: [],
		copy: [],
		observe: []
	};
	var defaultOptions = _defaultOptions;

	// Author: KennyTM @ StackOverflow
	function unionArrays (x, y) {
		var obj = {};
		for (var i = x.length - 1; i >= 0; -- i) obj[x[i]] = x[i];
		for (var i = y.length - 1; i >= 0; -- i) obj[y[i]] = y[i];
		var res = [];

		for (var k in obj) {
			res.push(obj[k]);
		};

		return res;
	}

	function extendObject(destination, source) {
		var destType;

		for (var key in source) {
			if (source.hasOwnProperty(key) && source[key]) {
				destType = exports.getType(destination[key]);
				if (key && destination[key] && destType !== "array" && destType !== "string") {
					extendObject(destination[key], source[key]);
				} else {
					var bothArrays = exports.getType(destination[key]) === "array" && exports.getType(source[key]) === "array";
					if (bothArrays) {
						destination[key] = unionArrays(destination[key], source[key]);
					} else {
						destination[key] = source[key];
					}
				}
			}
		}
	}

	function merge(obj1, obj2) {
		var merged = {};
		extendObject(merged, obj1);
		extendObject(merged, obj2);

		return merged;
	}

	exports.isMapped = function (viewModel) {
		var unwrapped = ko.utils.unwrapObservable(viewModel);
		return unwrapped && unwrapped[mappingProperty];
	}

	exports.fromJS = function (jsObject /*, inputOptions, target*/ ) {
		if (arguments.length == 0) throw new Error("When calling ko.fromJS, pass the object you want to convert.");

		try {
			if (!mappingNesting++) {
				dependentObservables = [];
				visitedObjects = new objectLookup();
			}

			var options;
			var target;

			if (arguments.length == 2) {
				if (arguments[1][mappingProperty]) {
					target = arguments[1];
				} else {
					options = arguments[1];
				}
			}
			if (arguments.length == 3) {
				options = arguments[1];
				target = arguments[2];
			}

			if (target) {
				options = merge(options, target[mappingProperty]);
			}
			options = fillOptions(options);

			var result = updateViewModel(target, jsObject, options);
			if (target) {
				result = target;
			}

			// Evaluate any dependent observables that were proxied.
			// Do this after the model's observables have been created
			if (!--mappingNesting) {
				while (dependentObservables.length) {
					var DO = dependentObservables.pop();
					if (DO) {
						DO();
						
						// Move this magic property to the underlying dependent observable
						DO.__DO["throttleEvaluation"] = DO["throttleEvaluation"];
					}
				}
			}

			// Save any new mapping options in the view model, so that updateFromJS can use them later.
			result[mappingProperty] = merge(result[mappingProperty], options);

			return result;
		} catch(e) {
			mappingNesting = 0;
			throw e;
		}
	};

	exports.fromJSON = function (jsonString /*, options, target*/ ) {
		var parsed = ko.utils.parseJson(jsonString);
		arguments[0] = parsed;
		return exports.fromJS.apply(this, arguments);
	};

	exports.updateFromJS = function (viewModel) {
		throw new Error("ko.mapping.updateFromJS, use ko.mapping.fromJS instead. Please note that the order of parameters is different!");
	};

	exports.updateFromJSON = function (viewModel) {
		throw new Error("ko.mapping.updateFromJSON, use ko.mapping.fromJSON instead. Please note that the order of parameters is different!");
	};

	exports.toJS = function (rootObject, options) {
		if (!defaultOptions) exports.resetDefaultOptions();

		if (arguments.length == 0) throw new Error("When calling ko.mapping.toJS, pass the object you want to convert.");
		if (exports.getType(defaultOptions.ignore) !== "array") throw new Error("ko.mapping.defaultOptions().ignore should be an array.");
		if (exports.getType(defaultOptions.include) !== "array") throw new Error("ko.mapping.defaultOptions().include should be an array.");
		if (exports.getType(defaultOptions.copy) !== "array") throw new Error("ko.mapping.defaultOptions().copy should be an array.");

		// Merge in the options used in fromJS
		options = fillOptions(options, rootObject[mappingProperty]);

		// We just unwrap everything at every level in the object graph
		return exports.visitModel(rootObject, function (x) {
			return ko.utils.unwrapObservable(x)
		}, options);
	};

	exports.toJSON = function (rootObject, options) {
		var plainJavaScriptObject = exports.toJS(rootObject, options);
		return ko.utils.stringifyJson(plainJavaScriptObject);
	};

	exports.defaultOptions = function () {
		if (arguments.length > 0) {
			defaultOptions = arguments[0];
		} else {
			return defaultOptions;
		}
	};

	exports.resetDefaultOptions = function () {
		defaultOptions = {
			include: _defaultOptions.include.slice(0),
			ignore: _defaultOptions.ignore.slice(0),
			copy: _defaultOptions.copy.slice(0)
		};
	};

	exports.getType = function(x) {
		if ((x) && (typeof (x) === "object")) {
			if (x.constructor === Date) return "date";
			if (x.constructor === Array) return "array";
		}
		return typeof x;
	}

	function fillOptions(rawOptions, otherOptions) {
		var options = merge({}, rawOptions);

		// Move recognized root-level properties into a root namespace
		for (var i = recognizedRootProperties.length - 1; i >= 0; i--) {
			var property = recognizedRootProperties[i];
			
			// Carry on, unless this property is present
			if (!options[property]) continue;
			
			// Move the property into the root namespace
			if (!(options[""] instanceof Object)) options[""] = {};
			options[""][property] = options[property];
			delete options[property];
		}

		if (otherOptions) {
			options.ignore = mergeArrays(otherOptions.ignore, options.ignore);
			options.include = mergeArrays(otherOptions.include, options.include);
			options.copy = mergeArrays(otherOptions.copy, options.copy);
			options.observe = mergeArrays(otherOptions.observe, options.observe);
		}
		options.ignore = mergeArrays(options.ignore, defaultOptions.ignore);
		options.include = mergeArrays(options.include, defaultOptions.include);
		options.copy = mergeArrays(options.copy, defaultOptions.copy);
		options.observe = mergeArrays(options.observe, defaultOptions.observe);

		options.mappedProperties = options.mappedProperties || {};
		options.copiedProperties = options.copiedProperties || {};
		return options;
	}

	function mergeArrays(a, b) {
		if (exports.getType(a) !== "array") {
			if (exports.getType(a) === "undefined") a = [];
			else a = [a];
		}
		if (exports.getType(b) !== "array") {
			if (exports.getType(b) === "undefined") b = [];
			else b = [b];
		}

		return ko.utils.arrayGetDistinctValues(a.concat(b));
	}

	// When using a 'create' callback, we proxy the dependent observable so that it doesn't immediately evaluate on creation.
	// The reason is that the dependent observables in the user-specified callback may contain references to properties that have not been mapped yet.
	function withProxyDependentObservable(dependentObservables, callback) {
		var localDO = ko.dependentObservable;
		ko.dependentObservable = function (read, owner, options) {
			options = options || {};

			if (read && typeof read == "object") { // mirrors condition in knockout implementation of DO's
				options = read;
			}

			var realDeferEvaluation = options.deferEvaluation;

			var isRemoved = false;

			// We wrap the original dependent observable so that we can remove it from the 'dependentObservables' list we need to evaluate after mapping has
			// completed if the user already evaluated the DO themselves in the meantime.
			var wrap = function (DO) {
				// Temporarily revert ko.dependentObservable, since it is used in ko.isWriteableObservable
				var tmp = ko.dependentObservable;
				ko.dependentObservable = realKoDependentObservable;
				var isWriteable = ko.isWriteableObservable(DO);
				ko.dependentObservable = tmp;

				var wrapped = realKoDependentObservable({
					read: function () {
						if (!isRemoved) {
							ko.utils.arrayRemoveItem(dependentObservables, DO);
							isRemoved = true;
						}
						return DO.apply(DO, arguments);
					},
					write: isWriteable && function (val) {
						return DO(val);
					},
					deferEvaluation: true
				});
				if (DEBUG) wrapped._wrapper = true;
				wrapped.__DO = DO;
				return wrapped;
			};
			
			options.deferEvaluation = true; // will either set for just options, or both read/options.
			var realDependentObservable = new realKoDependentObservable(read, owner, options);

			if (!realDeferEvaluation) {
				realDependentObservable = wrap(realDependentObservable);
				dependentObservables.push(realDependentObservable);
			}

			return realDependentObservable;
		}
		ko.dependentObservable.fn = realKoDependentObservable.fn;
		ko.computed = ko.dependentObservable;
		var result = callback();
		ko.dependentObservable = localDO;
		ko.computed = ko.dependentObservable;
		return result;
	}

	function updateViewModel(mappedRootObject, rootObject, options, parentName, parent, parentPropertyName, mappedParent) {
		var isArray = exports.getType(ko.utils.unwrapObservable(rootObject)) === "array";

		parentPropertyName = parentPropertyName || "";

		// If this object was already mapped previously, take the options from there and merge them with our existing ones.
		if (exports.isMapped(mappedRootObject)) {
			var previousMapping = ko.utils.unwrapObservable(mappedRootObject)[mappingProperty];
			options = merge(previousMapping, options);
		}

		var callbackParams = {
			data: rootObject,
			parent: mappedParent || parent
		};

		var hasCreateCallback = function () {
			return options[parentName] && options[parentName].create instanceof Function;
		};

		var createCallback = function (data) {
			return withProxyDependentObservable(dependentObservables, function () {
				
				if (ko.utils.unwrapObservable(parent) instanceof Array) {
					return options[parentName].create({
						data: data || callbackParams.data,
						parent: callbackParams.parent,
						skip: emptyReturn
					});
				} else {
					return options[parentName].create({
						data: data || callbackParams.data,
						parent: callbackParams.parent
					});
				}				
			});
		};

		var hasUpdateCallback = function () {
			return options[parentName] && options[parentName].update instanceof Function;
		};

		var updateCallback = function (obj, data) {
			var params = {
				data: data || callbackParams.data,
				parent: callbackParams.parent,
				target: ko.utils.unwrapObservable(obj)
			};

			if (ko.isWriteableObservable(obj)) {
				params.observable = obj;
			}

			return options[parentName].update(params);
		}

		var alreadyMapped = visitedObjects.get(rootObject);
		if (alreadyMapped) {
			return alreadyMapped;
		}

		parentName = parentName || "";

		if (!isArray) {
			// For atomic types, do a direct update on the observable
			if (!canHaveProperties(rootObject)) {
				switch (exports.getType(rootObject)) {
				case "function":
					if (hasUpdateCallback()) {
						if (ko.isWriteableObservable(rootObject)) {
							rootObject(updateCallback(rootObject));
							mappedRootObject = rootObject;
						} else {
							mappedRootObject = updateCallback(rootObject);
						}
					} else {
						mappedRootObject = rootObject;
					}
					break;
				default:
					if (ko.isWriteableObservable(mappedRootObject)) {
						if (hasUpdateCallback()) {
							var valueToWrite = updateCallback(mappedRootObject);
							mappedRootObject(valueToWrite);
							return valueToWrite;
						} else {
							var valueToWrite = ko.utils.unwrapObservable(rootObject);
							mappedRootObject(valueToWrite);
							return valueToWrite;
						}
					} else {
						var hasCreateOrUpdateCallback = hasCreateCallback() || hasUpdateCallback();
						
						if (hasCreateCallback()) {
							mappedRootObject = createCallback();
						} else {
							mappedRootObject = ko.observable(ko.utils.unwrapObservable(rootObject));
						}

						if (hasUpdateCallback()) {
							mappedRootObject(updateCallback(mappedRootObject));
						}
						
						if (hasCreateOrUpdateCallback) return mappedRootObject;
					}
				}

			} else {
				mappedRootObject = ko.utils.unwrapObservable(mappedRootObject);
				if (!mappedRootObject) {
					if (hasCreateCallback()) {
						var result = createCallback();

						if (hasUpdateCallback()) {
							result = updateCallback(result);
						}

						return result;
					} else {
						if (hasUpdateCallback()) {
							return updateCallback(result);
						}

						mappedRootObject = {};
					}
				}

				if (hasUpdateCallback()) {
					mappedRootObject = updateCallback(mappedRootObject);
				}

				visitedObjects.save(rootObject, mappedRootObject);
				if (hasUpdateCallback()) return mappedRootObject;

				// For non-atomic types, visit all properties and update recursively
				visitPropertiesOrArrayEntries(rootObject, function (indexer) {
					var fullPropertyName = parentPropertyName.length ? parentPropertyName + "." + indexer : indexer;

					if (ko.utils.arrayIndexOf(options.ignore, fullPropertyName) != -1) {
						return;
					}

					if (ko.utils.arrayIndexOf(options.copy, fullPropertyName) != -1) {
						mappedRootObject[indexer] = rootObject[indexer];
						return;
					}

					if(typeof rootObject[indexer] != "object" && typeof rootObject[indexer] != "array" && options.observe.length > 0 && ko.utils.arrayIndexOf(options.observe, fullPropertyName) == -1)
					{
						mappedRootObject[indexer] = rootObject[indexer];
						options.copiedProperties[fullPropertyName] = true;
						return;
					}
					
					// In case we are adding an already mapped property, fill it with the previously mapped property value to prevent recursion.
					// If this is a property that was generated by fromJS, we should use the options specified there
					var prevMappedProperty = visitedObjects.get(rootObject[indexer]);
					var retval = updateViewModel(mappedRootObject[indexer], rootObject[indexer], options, indexer, mappedRootObject, fullPropertyName, mappedRootObject);
					var value = prevMappedProperty || retval;
					
					if(options.observe.length > 0 && ko.utils.arrayIndexOf(options.observe, fullPropertyName) == -1)
					{
						mappedRootObject[indexer] = value();
						options.copiedProperties[fullPropertyName] = true;
						return;
					}
					
					if (ko.isWriteableObservable(mappedRootObject[indexer])) {
						value = ko.utils.unwrapObservable(value);
						if (mappedRootObject[indexer]() !== value) {
							mappedRootObject[indexer](value);
						}
					} else {
						value = mappedRootObject[indexer] === undefined ? value : ko.utils.unwrapObservable(value);
						mappedRootObject[indexer] = value;
					}

					options.mappedProperties[fullPropertyName] = true;
				});
			}
		} else { //mappedRootObject is an array
			var changes = [];

			var hasKeyCallback = false;
			var keyCallback = function (x) {
				return x;
			}
			if (options[parentName] && options[parentName].key) {
				keyCallback = options[parentName].key;
				hasKeyCallback = true;
			}

			if (!ko.isObservable(mappedRootObject)) {
				// When creating the new observable array, also add a bunch of utility functions that take the 'key' of the array items into account.
				mappedRootObject = ko.observableArray([]);

				mappedRootObject.mappedRemove = function (valueOrPredicate) {
					var predicate = typeof valueOrPredicate == "function" ? valueOrPredicate : function (value) {
							return value === keyCallback(valueOrPredicate);
						};
					return mappedRootObject.remove(function (item) {
						return predicate(keyCallback(item));
					});
				}

				mappedRootObject.mappedRemoveAll = function (arrayOfValues) {
					var arrayOfKeys = filterArrayByKey(arrayOfValues, keyCallback);
					return mappedRootObject.remove(function (item) {
						return ko.utils.arrayIndexOf(arrayOfKeys, keyCallback(item)) != -1;
					});
				}

				mappedRootObject.mappedDestroy = function (valueOrPredicate) {
					var predicate = typeof valueOrPredicate == "function" ? valueOrPredicate : function (value) {
							return value === keyCallback(valueOrPredicate);
						};
					return mappedRootObject.destroy(function (item) {
						return predicate(keyCallback(item));
					});
				}

				mappedRootObject.mappedDestroyAll = function (arrayOfValues) {
					var arrayOfKeys = filterArrayByKey(arrayOfValues, keyCallback);
					return mappedRootObject.destroy(function (item) {
						return ko.utils.arrayIndexOf(arrayOfKeys, keyCallback(item)) != -1;
					});
				}

				mappedRootObject.mappedIndexOf = function (item) {
					var keys = filterArrayByKey(mappedRootObject(), keyCallback);
					var key = keyCallback(item);
					return ko.utils.arrayIndexOf(keys, key);
				}

				mappedRootObject.mappedGet = function (item) {
					return mappedRootObject()[mappedRootObject.mappedIndexOf(item)];
				}

				mappedRootObject.mappedCreate = function (value) {
					if (mappedRootObject.mappedIndexOf(value) !== -1) {
						throw new Error("There already is an object with the key that you specified.");
					}

					var item = hasCreateCallback() ? createCallback(value) : value;
					if (hasUpdateCallback()) {
						var newValue = updateCallback(item, value);
						if (ko.isWriteableObservable(item)) {
							item(newValue);
						} else {
							item = newValue;
						}
					}
					mappedRootObject.push(item);
					return item;
				}
			}

			var currentArrayKeys = filterArrayByKey(ko.utils.unwrapObservable(mappedRootObject), keyCallback).sort();
			var newArrayKeys = filterArrayByKey(rootObject, keyCallback);
			if (hasKeyCallback) newArrayKeys.sort();
			var editScript = ko.utils.compareArrays(currentArrayKeys, newArrayKeys);

			var ignoreIndexOf = {};
			
			var i, j;

			var unwrappedRootObject = ko.utils.unwrapObservable(rootObject);
			var itemsByKey = {};
			var optimizedKeys = true;
			for (i = 0, j = unwrappedRootObject.length; i < j; i++) {
				var key = keyCallback(unwrappedRootObject[i]);
				if (key === undefined || key instanceof Object) {
					optimizedKeys = false;
					break;
				}
				itemsByKey[key] = unwrappedRootObject[i];
			}

			var newContents = [];
			var passedOver = 0;
			for (i = 0, j = editScript.length; i < j; i++) {
				var key = editScript[i];
				var mappedItem;
				var fullPropertyName = parentPropertyName + "[" + i + "]";
				switch (key.status) {
				case "added":
					var item = optimizedKeys ? itemsByKey[key.value] : getItemByKey(ko.utils.unwrapObservable(rootObject), key.value, keyCallback);
					mappedItem = updateViewModel(undefined, item, options, parentName, mappedRootObject, fullPropertyName, parent);
					if(!hasCreateCallback()) {
						mappedItem = ko.utils.unwrapObservable(mappedItem);
					}

					var index = ignorableIndexOf(ko.utils.unwrapObservable(rootObject), item, ignoreIndexOf);
					
					if (mappedItem === emptyReturn) {
						passedOver++;
					} else {
						newContents[index - passedOver] = mappedItem;
					}
						
					ignoreIndexOf[index] = true;
					break;
				case "retained":
					var item = optimizedKeys ? itemsByKey[key.value] : getItemByKey(ko.utils.unwrapObservable(rootObject), key.value, keyCallback);
					mappedItem = getItemByKey(mappedRootObject, key.value, keyCallback);
					updateViewModel(mappedItem, item, options, parentName, mappedRootObject, fullPropertyName, parent);

					var index = ignorableIndexOf(ko.utils.unwrapObservable(rootObject), item, ignoreIndexOf);
					newContents[index] = mappedItem;
					ignoreIndexOf[index] = true;
					break;
				case "deleted":
					mappedItem = getItemByKey(mappedRootObject, key.value, keyCallback);
					break;
				}

				changes.push({
					event: key.status,
					item: mappedItem
				});
			}

			mappedRootObject(newContents);

			if (options[parentName] && options[parentName].arrayChanged) {
				ko.utils.arrayForEach(changes, function (change) {
					options[parentName].arrayChanged(change.event, change.item);
				});
			}
		}

		return mappedRootObject;
	}

	function ignorableIndexOf(array, item, ignoreIndices) {
		for (var i = 0, j = array.length; i < j; i++) {
			if (ignoreIndices[i] === true) continue;
			if (array[i] === item) return i;
		}
		return null;
	}

	function mapKey(item, callback) {
		var mappedItem;
		if (callback) mappedItem = callback(item);
		if (exports.getType(mappedItem) === "undefined") mappedItem = item;

		return ko.utils.unwrapObservable(mappedItem);
	}

	function getItemByKey(array, key, callback) {
		array = ko.utils.unwrapObservable(array);
		for (var i = 0, j = array.length; i < j; i++) {
			var item = array[i];
			if (mapKey(item, callback) === key) return item;
		}

		throw new Error("When calling ko.update*, the key '" + key + "' was not found!");
	}

	function filterArrayByKey(array, callback) {
		return ko.utils.arrayMap(ko.utils.unwrapObservable(array), function (item) {
			if (callback) {
				return mapKey(item, callback);
			} else {
				return item;
			}
		});
	}

	function visitPropertiesOrArrayEntries(rootObject, visitorCallback) {
		if (exports.getType(rootObject) === "array") {
			for (var i = 0; i < rootObject.length; i++)
			visitorCallback(i);
		} else {
			for (var propertyName in rootObject)
			visitorCallback(propertyName);
		}
	};

	function canHaveProperties(object) {
		var type = exports.getType(object);
		return ((type === "object") || (type === "array")) && (object !== null);
	}

	// Based on the parentName, this creates a fully classified name of a property

	function getPropertyName(parentName, parent, indexer) {
		var propertyName = parentName || "";
		if (exports.getType(parent) === "array") {
			if (parentName) {
				propertyName += "[" + indexer + "]";
			}
		} else {
			if (parentName) {
				propertyName += ".";
			}
			propertyName += indexer;
		}
		return propertyName;
	}

	exports.visitModel = function (rootObject, callback, options) {
		options = options || {};
		options.visitedObjects = options.visitedObjects || new objectLookup();

		var mappedRootObject;
		var unwrappedRootObject = ko.utils.unwrapObservable(rootObject);

		if (!canHaveProperties(unwrappedRootObject)) {
			return callback(rootObject, options.parentName);
		} else {
			options = fillOptions(options, unwrappedRootObject[mappingProperty]);

			// Only do a callback, but ignore the results
			callback(rootObject, options.parentName);
			mappedRootObject = exports.getType(unwrappedRootObject) === "array" ? [] : {};
		}

		options.visitedObjects.save(rootObject, mappedRootObject);

		var parentName = options.parentName;
		visitPropertiesOrArrayEntries(unwrappedRootObject, function (indexer) {
			if (options.ignore && ko.utils.arrayIndexOf(options.ignore, indexer) != -1) return;

			var propertyValue = unwrappedRootObject[indexer];
			options.parentName = getPropertyName(parentName, unwrappedRootObject, indexer);

			// If we don't want to explicitly copy the unmapped property...
			if (ko.utils.arrayIndexOf(options.copy, indexer) === -1) {
				// ...find out if it's a property we want to explicitly include
				if (ko.utils.arrayIndexOf(options.include, indexer) === -1) {
					// The mapped properties object contains all the properties that were part of the original object.
					// If a property does not exist, and it is not because it is part of an array (e.g. "myProp[3]"), then it should not be unmapped.
				    if (unwrappedRootObject[mappingProperty]
				        && unwrappedRootObject[mappingProperty].mappedProperties && !unwrappedRootObject[mappingProperty].mappedProperties[indexer]
				        && unwrappedRootObject[mappingProperty].copiedProperties && !unwrappedRootObject[mappingProperty].copiedProperties[indexer]
				        && !(exports.getType(unwrappedRootObject) === "array")) {
						return;
					}
				}
			}

			var outputProperty;
			switch (exports.getType(ko.utils.unwrapObservable(propertyValue))) {
			case "object":
			case "array":
			case "undefined":
				var previouslyMappedValue = options.visitedObjects.get(propertyValue);
				mappedRootObject[indexer] = (exports.getType(previouslyMappedValue) !== "undefined") ? previouslyMappedValue : exports.visitModel(propertyValue, callback, options);
				break;
			default:
				mappedRootObject[indexer] = callback(propertyValue, options.parentName);
			}
		});

		return mappedRootObject;
	}

	function simpleObjectLookup() {
		var keys = [];
		var values = [];
		this.save = function (key, value) {
			var existingIndex = ko.utils.arrayIndexOf(keys, key);
			if (existingIndex >= 0) values[existingIndex] = value;
			else {
				keys.push(key);
				values.push(value);
			}
		};
		this.get = function (key) {
			var existingIndex = ko.utils.arrayIndexOf(keys, key);
			var value = (existingIndex >= 0) ? values[existingIndex] : undefined;
			return value;
		};
	};
	
	function objectLookup() {
		var buckets = {};
		
		var findBucket = function(key) {
			var bucketKey;
			try {
				bucketKey = key;//JSON.stringify(key);
			}
			catch (e) {
				bucketKey = "$$$";
			}

			var bucket = buckets[bucketKey];
			if (bucket === undefined) {
				bucket = new simpleObjectLookup();
				buckets[bucketKey] = bucket;
			}
			return bucket;
		};
		
		this.save = function (key, value) {
			findBucket(key).save(key, value);
		};
		this.get = function (key) {
			return findBucket(key).get(key);
		};
	};
}));
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],41:[function(require,module,exports){
(function (global){
// Knockout Fast Mapping v0.1
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

(function (factory) {
	// Module systems magic dance.

	if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
		// CommonJS or Node: hard-coded dependency on "knockout"
		factory((typeof window !== "undefined" ? window['ko'] : typeof global !== "undefined" ? global['ko'] : null), exports);
	} else if (typeof define === "function" && define["amd"]) {
		// AMD anonymous module with hard-coded dependency on "knockout"
		define(["knockout", "exports"], factory);
	} else {
		// <script> tag: use the global `ko` object, attaching a `wrap` property
		factory(ko, ko.wrap = {});
	}
}(function (ko, exports) {
    
    // this function mimics ko.mapping
    exports.fromJS = function(jsObject, computedFunctions)
    {
        reset();
	return wrap(jsObject, computedFunctions);
    }

    // this function unwraps the outer for assigning the result to an observable
    // see https://github.com/SteveSanderson/knockout/issues/517
    exports.updateFromJS = function(observable, jsObject, computedFunctions)
    {
        reset();
	return observable(ko.utils.unwrapObservable(wrap(jsObject, computedFunctions)));
    }

    exports.fromJSON = function (jsonString, computedFunctions) {
	var parsed = ko.utils.parseJson(jsonString);
	arguments[0] = parsed;
	return exports.fromJS.apply(this, computedFunctions);
    };
    
    exports.toJS = function (observable) {
	return unwrap(observable);
    }

    exports.toJSON = function (observable) {
	var plainJavaScriptObject = exports.toJS(observable);
	return ko.utils.stringifyJson(plainJavaScriptObject);
    };

    function typeOf(value) {
	var s = typeof value;
	if (s === 'object') {
            if (value) {
                if (value.constructor == Date)
                    s = 'date';
		else if (Object.prototype.toString.call(value) == '[object Array]')
                    s = 'array';
            } else {
		s = 'null';
            }
	}
	return s;
    }

    // unwrapping
    function unwrapObject(o)
    {
	var t = {};

	for (var k in o)
	{
	    var v = o[k];

	    if (ko.isComputed(v))
		continue;

	    t[k] = unwrap(v);
	}

	return t;
    }

    function unwrapArray(a)
    {
	var r = [];

	if (!a || a.length == 0)
	    return r;
	
	for (var i = 0, l = a.length; i < l; ++i)
	    r.push(unwrap(a[i]));

	return r;
    }

    function unwrap(v)
    {
	var isObservable = ko.isObservable(v);

	if (isObservable)
	{
	    var val = v();

	    return unwrap(val);
	}
	else
	{
	    if (typeOf(v) == "array")
	    {
		return unwrapArray(v);
	    }
	    else if (typeOf(v) == "object")
	    {
		return unwrapObject(v);
	    }
	    else
	    {
		return v;
	    }
	}
    }

    function reset()
    {
        parents = [{obj: null, wrapped: null, lvl: ""}];
    }    
    
    // wrapping

    function wrapObject(o, computedFunctions)
    {
        // check for infinite recursion
        for (var i = 0; i < parents.length; ++i) {
            if (parents[i].obj === o) {
                return parents[i].wrapped;
            }
        }

	var t = {};

	for (var k in o)
	{
	    var v = o[k];

            parents.push({obj: o, wrapped: t, lvl: currentLvl() + "/" + k});

	    t[k] = wrap(v, computedFunctions);

            parents.pop();
	}

	if (computedFunctions && computedFunctions[currentLvl()])
	    t = computedFunctions[currentLvl()](t);

        if (hasES5Plugin())
            ko.track(t);

	return t;
    }

    function wrapArray(a, computedFunctions)
    {
	var r = ko.observableArray();

	if (!a || a.length == 0)
	    return r;

	for (var i = 0, l = a.length; i < l; ++i)
	    r.push(wrap(a[i], computedFunctions));

	return r;
    }

    // a stack, used for two purposes:
    //  - circular reference checking
    //  - computed functions
    var parents;

    function currentLvl()
    {
	return parents[parents.length-1].lvl;
    }

    function wrap(v, computedFunctions)
    {
	if (typeOf(v) == "array")
	{
	    return wrapArray(v, computedFunctions);
	}
	else if (typeOf(v) == "object")
	{
	    return wrapObject(v, computedFunctions);
	}
	else
	{
            if (!hasES5Plugin() && typeof v !== 'function')
            {
	        var t = ko.observable();
	        t(v);
	        return t;
            } else
                return v;
	}
    }

    function hasES5Plugin()
    {
        return ko.track != null;
    }
}));
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[31])(31)
});
//# sourceMappingURL=herocalc.js.map
