const v = require('validator');
const fuzzysort = require('fuzzysort');
const {itemnames, itemdefs, itemdefscustom} = require('./constant');

exports.validateSkill = skill => {
    if (skill !== undefined) {
        skill = v.escape(v.trim(skill));
        if (!v.isAlpha(skill)) {
            skill = 'overall';
        }
    }
    return skill;
};

exports.validateRank = rank => {
    if (rank !== undefined) {
        rank = v.escape(v.trim(rank));
        if (!v.isNumeric(rank)) {
            rank = undefined;
        }
    }
    return parseInt(rank);
};

exports.validateName = name => {
    if (name !== undefined) {
        name = v.escape(v.trim(name));
        if (!v.matches(name, /[A-Za-z0-9 ]+/)) {
            name = undefined;
        }
    }
    return name;
};

exports.validateItem = item => {
    if (item !== undefined) {
        item = v.escape(v.trim(item));
        if (!v.matches(item, /[A-Za-z0-9 -']+/)) {
            return undefined;
        }
    }
    return item;
};

exports.joinById = (...lists) => {
    return Object.values(lists.reduce((idx, list) => {
        list.forEach((record) => {
            if (idx[record.id])
                idx[record.id] = Object.assign(idx[record.id], record)
            else
                idx[record.id] = record
        })
        return idx
    }, {}))
};

const options = {
    limit: 25, // don't return more results than you need!
    allowTypo: true, // if you don't care about allowing typos
    threshold: -5000, // don't return bad results
};
exports.fuzzysearch = word => {
    const results = fuzzysort.go(word.toLowerCase(), itemnames, options);
    delete results.total;
    return Object.values(results).map(value => value.target);
};

exports.namesToIds = (names, type) => {
    let namesAndIds = {};
    let defs = itemdefs.filter(def => names.includes(def.name.toLowerCase()));
    if (type === 'cabbage') {
        const custom = itemdefscustom.filter(def => names.includes(def.name.toLowerCase()));
        if (custom.length > 0) {
            defs = defs.concat(custom);
        }
    }
    return defs.map(value => {
        return {
            id: value.id,
            name: value.name,
            description: value.description,
            amount: 0
        };
    });
};