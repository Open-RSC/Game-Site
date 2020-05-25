const v = require('validator');

exports.validateSkill = (skill) => {
    if (skill !== undefined) {
        skill = v.trim(v.escape(skill));
        if (!v.isAlpha(skill)) {
            skill = 'overall';
        }
    }
    return skill;
};

exports.validateRank = (rank) => {
    if (rank !== undefined) {
        rank = v.trim(v.escape(rank));
        if (!v.isNumeric(rank)) {
            rank = undefined;
        }
    }
    return rank;
};

exports.validateName = (name) => {
    if (name !== undefined) {
        name = v.trim(v.escape(name));
        if (!v.isAlphanumeric(name)) {
            name = undefined;
        }
    }
    return name;
}