define(["require","exports","module","herocalc_knockout","./herocalc_core"],function(e,a,t){"use strict";var i=e("herocalc_knockout"),l=e("./herocalc_core").HEROCALCULATOR;l.prototype.DamageAmpViewModel=function(e){var a=new l.prototype.BuffViewModel(i.observableArray([]));return a.availableBuffs=i.observableArray([new l.prototype.BuffOption("slardar","slardar_sprint"),new l.prototype.BuffOption("undying","undying_flesh_golem"),new l.prototype.BuffOption("chen","chen_penitence"),new l.prototype.BuffOption("medusa","medusa_stone_gaze"),new l.prototype.BuffOption("shadow_demon","shadow_demon_soul_catcher")]),a.availableDebuffs=i.observableArray([new l.prototype.BuffOption("medusa","medusa_mana_shield"),new l.prototype.BuffOption("spectre","spectre_dispersion"),new l.prototype.BuffOption("wisp","wisp_overcharge"),new l.prototype.BuffOption("bristleback","bristleback_bristleback"),new l.prototype.BuffOption("kunkka","kunkka_ghostship")]),a.selectedBuff=i.observable(a.availableBuffs()[0]),a.buffs=i.observableArray([]),a.getAbilityDamageAmpValue=function(e,t){var i=l.prototype.findWhere(a.buffs(),{name:e});if(void 0==i)return 0;var r=i.data;return a.getAbilityAttributeValue(r.attributes(),t,r.level())},a.getDamageMultiplierSources=i.computed(function(){for(var e={},t=0;t<a.abilities().length;t++){var i=a.abilities()[t];if(i.level()>0&&(i.isActive()||-1!=i.behavior().indexOf("DOTA_ABILITY_BEHAVIOR_PASSIVE")))switch(i.name()){case"bristleback_bristleback":e[i.name()]={multiplier:i.damageReduction()/100,damageType:"physical",displayname:i.displayname()};break;case"slardar_sprint":e[i.name()]={multiplier:a.getAbilityAttributeValue(i.attributes(),"bonus_damage",i.level())/100,damageType:"physical",displayname:i.displayname()};break;case"undying_flesh_golem":e[i.name()]={multiplier:i.damageAmplification()/100,damageType:"physical",displayname:i.displayname()};break;case"medusa_stone_gaze":e[i.name()]={multiplier:a.getAbilityAttributeValue(i.attributes(),"bonus_physical_damage",i.level())/100,damageType:"physical",displayname:i.displayname()};break;case"chen_penitence":e[i.name()]={multiplier:a.getAbilityAttributeValue(i.attributes(),"bonus_damage_taken",i.level())/100,damageType:"physical",displayname:i.displayname()};break;case"shadow_demon_soul_catcher":e[i.name()]={multiplier:a.getAbilityAttributeValue(i.attributes(),"bonus_damage_taken",i.level())/100,damageType:"pure",displayname:i.displayname()};break;case"medusa_mana_shield":e[i.name()]={multiplier:i.damageReduction()/100,damageType:"physical",displayname:i.displayname()};break;case"spectre_dispersion":e[i.name()]={multiplier:-a.getAbilityAttributeValue(i.attributes(),"damage_reflection_pct",i.level())/100,damageType:"percentreduction",displayname:i.displayname()};break;case"abaddon_aphotic_shield":e[i.name()]={multiplier:a.getAbilityAttributeValue(i.attributes(),"damage_absorb",i.level()),damageType:"flatreduction",displayname:i.displayname()};break;case"kunkka_ghostship":e[i.name()]={multiplier:-0.5,damageType:"percentreduction",displayname:i.displayname()};break;case"wisp_overcharge":e[i.name()]={multiplier:a.getAbilityAttributeValue(i.attributes(),"bonus_damage_pct",i.level())/100,damageType:"percentreduction",displayname:i.displayname()}}}return e}),a}});