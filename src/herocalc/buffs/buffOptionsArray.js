var BuffModel = require("./BuffModel");

var buffOptionsArray = {};

var init = function () {
    buffOptionsArray.items = [
        new BuffModel('abaddon', 'abaddon_frostmourne'),
        new BuffModel('axe', 'axe_culling_blade'),
        new BuffModel('beastmaster', 'beastmaster_inner_beast'),
        new BuffModel('bloodseeker', 'bloodseeker_bloodrage'),
        new BuffModel('bounty_hunter', 'bounty_hunter_track'),
        new BuffModel('centaur', 'centaur_stampede'),
        new BuffModel('crystal_maiden', 'crystal_maiden_brilliance_aura'),
        new BuffModel('dark_seer', 'dark_seer_surge'),
        new BuffModel('dazzle', 'dazzle_weave'),
        new BuffModel('drow_ranger', 'drow_ranger_trueshot'),
        new BuffModel('invoker', 'invoker_alacrity'),
        new BuffModel('wisp', 'wisp_tether'),
        new BuffModel('wisp', 'wisp_overcharge'),
        new BuffModel('kunkka', 'kunkka_ghostship'),
        new BuffModel('lich', 'lich_frost_armor'),
        new BuffModel('life_stealer', 'life_stealer_open_wounds'),
        new BuffModel('luna', 'luna_lunar_blessing'),
        new BuffModel('lycan', 'lycan_howl'),
        new BuffModel('magnataur', 'magnataur_empower'),
        new BuffModel('mirana', 'mirana_leap'),
        new BuffModel('ogre_magi', 'ogre_magi_bloodlust'),
        new BuffModel('omniknight', 'omniknight_guardian_angel'),
        new BuffModel('rubick', 'rubick_null_field'),
        new BuffModel('skeleton_king', 'skeleton_king_vampiric_aura'),
        new BuffModel('spirit_breaker', 'spirit_breaker_empowering_haste'),
        new BuffModel('sven', 'sven_warcry'),
        new BuffModel('sven', 'sven_gods_strength'),
        new BuffModel('treant', 'treant_living_armor'),
        new BuffModel('troll_warlord', 'troll_warlord_battle_trance'),
        new BuffModel('vengefulspirit', 'vengefulspirit_command_aura'),
        new BuffModel('npc_dota_neutral_alpha_wolf', 'alpha_wolf_critical_strike'),
        new BuffModel('npc_dota_neutral_alpha_wolf', 'alpha_wolf_command_aura'),
        new BuffModel('npc_dota_neutral_polar_furbolg_ursa_warrior', 'centaur_khan_endurance_aura'),
        new BuffModel('npc_dota_neutral_giant_wolf', 'giant_wolf_critical_strike'),
        new BuffModel('npc_dota_neutral_kobold_taskmaster', 'kobold_taskmaster_speed_aura'),
        new BuffModel('npc_dota_neutral_ogre_magi', 'ogre_magi_frost_armor'),
        new BuffModel('npc_dota_neutral_satyr_hellcaller', 'satyr_hellcaller_unholy_aura'),
        new BuffModel('npc_dota_neutral_enraged_wildkin', 'enraged_wildkin_toughness_aura'),
        new BuffModel('npc_dota_necronomicon_archer_1', 'necronomicon_archer_aoe')
    ];
    return buffOptionsArray.items;
}

buffOptionsArray.init = init;

module.exports = buffOptionsArray;