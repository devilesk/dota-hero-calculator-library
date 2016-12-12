module.exports = {
    getBonusDamage: function (talents) {
        var totalAttribute = 0;
        var sources = {};
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            switch (ability.name) {
                case 'special_bonus_attack_damage_25':
                    totalAttribute += ability.attributes[0].value[0];
                    sources[ability.name] = {
                        'damage': ability.attributes[0].value[0],
                        'damageType': 'physical',
                        'displayname': ability.displayname
                    }
                break;
            }
        }
        return { sources: sources, total: totalAttribute };
    },
    getMana: function (talents) {
        var totalAttribute = 0;
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            switch (ability.name) {
                case 'special_bonus_mp_200':
                    totalAttribute += ability.attributes[0].value[0];
                break;
            }
        }
        return totalAttribute;
    },
    getArmor: function (talents) {
        var totalAttribute = 0;
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            switch (ability.name) {
                case 'special_bonus_armor_5':
                    totalAttribute += ability.attributes[0].value[0];
                break;
            }
        }
        return totalAttribute;
    },
    getMovementSpeedFlat: function (talents) {
        var totalAttribute = 0;
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            switch (ability.name) {
                case 'special_bonus_movement_speed_25':
                    totalAttribute += ability.attributes[0].value[0];
                break;
            }
        }
        return totalAttribute;
    },
    getStrength: function (talents) {
        var totalAttribute = 0;
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            switch (ability.name) {
                case 'special_bonus_strength_25':
                    totalAttribute += ability.attributes[0].value[0];
                break;
            }
        }
        return totalAttribute;
    }
}