const {OPENRSC, CABBAGE} = require('./constant');

exports.overallQuery = (type, rank, name) => {
    let query = 'SELECT openrsc_players.username, openrsc_players.skill_total, ';
    query += 'exp_attack, exp_defense, exp_strength, exp_hits, exp_ranged, exp_prayer, exp_magic, exp_cooking, exp_woodcut, exp_fletching, exp_fishing, exp_firemaking, exp_crafting, exp_smithing, exp_mining, exp_herblaw, exp_agility, exp_thieving ';
    if (type == CABBAGE) {
        query += ', exp_harvesting, exp_runecraft ';
    }
    query += 'FROM openrsc_players JOIN openrsc_experience ON openrsc_players.id = openrsc_experience.playerID ';
    if (rank !== undefined) {
        query += 'ORDER BY openrsc_players.skill_total DESC '
        query += 'LIMIT ' + (rank > 6 ? rank - 7 : 0) + ', 16;';
    }
    /*else if (name !== undefined) {

    }*/
    else {
        query += 'ORDER BY openrsc_players.skill_total DESC LIMIT 16;';
    }
    return query;
}

exports.hiscoresSkillQuery = (skill, rank, name) => {
    let query = 'SELECT openrsc_players.username, ';
    query += 'openrsc_experience.exp_' + skill + ', ';
    query += 'openrsc_curstats.cur_' + skill;
    query += ' FROM openrsc_players ';
    query += 'JOIN openrsc_experience ON openrsc_players.id = openrsc_experience.playerID ';
    query += 'JOIN openrsc_curstats ON openrsc_players.id = openrsc_curstats.playerID ';
    if (rank !== undefined) {
        query += 'ORDER BY openrsc_experience.exp_' + skill + ' DESC';
        query += ' LIMIT ' + (rank > 6 ? rank - 7 : 0) + ', 16;';
    }
    /*else if (name !== undefined) {
        
    }*/
    else {
        query += 'ORDER BY openrsc_experience.exp_' + skill ;
        query += ' DESC LIMIT 16;';
    }
    return query;
}
