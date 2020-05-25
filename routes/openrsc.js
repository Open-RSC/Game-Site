const express = require('express');
const router = express.Router();
const db = require('../db');
const constant = require('../constant');
const helper = require('../helper');

router.get('/', (req, res, next) => {
    db.homepageStatistics(res, constant.OPENRSC, 'openrsc');
});

router.get('/hiscores', (req, res, next) => {
    let skill = helper.validateSkill(req.query.skill);
    db.getHiscores(res, constant.OPENRSC, skill);
});

router.post('/hiscores', (req, res, next) => {
    let skill = helper.validateSkill(req.query.skill);
    let rank = helper.validateRank(req.body.rank);
    let name = helper.validateName(req.body.name);
    if (!isNaN(rank) && name !== undefined) {
        name = undefined;
    }
    db.getHiscores(res, constant.OPENRSC, skill, rank, name);
});

module.exports = router;
