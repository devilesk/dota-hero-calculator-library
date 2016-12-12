module.exports = {
    getBonusDamage: function (talents) {
        var totalAttribute = 0;
        var sources = {};
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            if (ability.name.startsWith('special_bonus_attack_damage_')) {
                totalAttribute += ability.attributes[0].value[0];
                sources[ability.name] = {
                    'damage': ability.attributes[0].value[0],
                    'damageType': 'physical',
                    'displayname': ability.displayname
                }
            }
        }
        return { sources: sources, total: totalAttribute };
    },
    getHealth: function (talents) {
        var totalAttribute = 0;
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            if (ability.name.startsWith('special_bonus_hp_') && !ability.name.startsWith('special_bonus_hp_regen_')) {
                totalAttribute += ability.attributes[0].value[0];
            }
        }
        return totalAttribute;
    },
    getHealthRegen: function (talents) {
        var totalAttribute = 0;
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            if (ability.name.startsWith('special_bonus_hp_regen_')) {
                totalAttribute += ability.attributes[0].value[0];
            }
        }
        return totalAttribute;
    },
    getMana: function (talents) {
        var totalAttribute = 0;
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            if (ability.name.startsWith('special_bonus_mp_') && !ability.name.startsWith('special_bonus_mp_regen_')) {
                totalAttribute += ability.attributes[0].value[0];
            }
        }
        return totalAttribute;
    },
    getManaRegen: function (talents) {
        var totalAttribute = 0;
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            if (ability.name.startsWith('special_bonus_mp_regen_')) {
                totalAttribute += ability.attributes[0].value[0];
            }
        }
        return totalAttribute;
    },
    getArmor: function (talents) {
        var totalAttribute = 0;
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            if (ability.name.startsWith('special_bonus_armor_')) {
                totalAttribute += ability.attributes[0].value[0];
            }
        }
        return totalAttribute;
    },
    getMovementSpeedFlat: function (talents) {
        var totalAttribute = 0;
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            if (ability.name.startsWith('special_bonus_movement_speed_')) {
                totalAttribute += ability.attributes[0].value[0];
            }
        }
        return totalAttribute;
    },
    getAttackRange: function (talents) {
        var totalAttribute = 0;
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            if (ability.name.startsWith('special_bonus_attack_range_')) {
                totalAttribute += ability.attributes[0].value[0];
            }
        }
        return totalAttribute;
    },
    getAttackSpeed: function (talents) {
        var totalAttribute = 0;
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            if (ability.name.startsWith('special_bonus_attack_speed_')) {
                totalAttribute += ability.attributes[0].value[0];
            }
        }
        return totalAttribute;
    },
    getLifesteal: function (talents) {
        var totalAttribute = 0;
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            if (ability.name.startsWith('special_bonus_lifesteal_')) {
                totalAttribute += ability.attributes[0].value[0];
            }
        }
        return totalAttribute;
    },
    getEvasion: function (talents) {
        var totalAttribute = 1;
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            if (ability.name.startsWith('special_bonus_evasion_')) {
                totalAttribute *= (1 - ability.attributes[0].value[0]/100);
            }
        }
        return totalAttribute;
    },
    getMagicResist: function (talents) {
        var totalAttribute = 1;
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            if (ability.name.startsWith('special_bonus_magic_resistance_')) {
                totalAttribute *= (1 - ability.attributes[0].value[0]/100);
            }
        }
        return totalAttribute;
    },
    getRespawnReduction: function (talents) {
        var totalAttribute = 0;
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            if (ability.name.startsWith('special_bonus_respawn_reduction_')) {
                totalAttribute += ability.attributes[0].value[0];
            }
        }
        return totalAttribute;
    },
    getStrength: function (talents) {
        var totalAttribute = 0;
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            if (ability.name.startsWith('special_bonus_strength_')) {
                totalAttribute += ability.attributes[0].value[0];
            }
            else if (ability.name.startsWith('special_bonus_all_stats_')) {
                totalAttribute += ability.attributes[0].value[0];
            }
        }
        return totalAttribute;
    },
    getAgility: function (talents) {
        var totalAttribute = 0;
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            if (ability.name.startsWith('special_bonus_agility_')) {
                totalAttribute += ability.attributes[0].value[0];
            }
            else if (ability.name.startsWith('special_bonus_all_stats_')) {
                totalAttribute += ability.attributes[0].value[0];
            }
        }
        return totalAttribute;
    },
    getIntelligence: function (talents) {
        var totalAttribute = 0;
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            if (ability.name.startsWith('special_bonus_intelligence_')) {
                totalAttribute += ability.attributes[0].value[0];
            }
            else if (ability.name.startsWith('special_bonus_all_stats_')) {
                totalAttribute += ability.attributes[0].value[0];
            }
        }
        return totalAttribute;
    }
}