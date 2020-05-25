const express = require('express');
const router = express.Router();
const db = require('../db');
const constant = require('../constant');
const helper = require('../helper');

router.get('/', (req, res, next) => {
    db.homepageStatistics(res, constant.CABBAGE, 'cabbage');
});

router.get('/hiscores', (req, res, next) => {
    let skill = helper.validateSkill(req.query.skill);
    db.getHiscores(res, constant.CABBAGE, skill);
});

router.post('/hiscores', (req, res, next) => {
    let skill = helper.validateSkill(req.query.skill);
    let rank = helper.validateRank(req.body.rank);
    let name = helper.validateName(req.body.name);
    if (rank !== undefined && name !== undefined) {
        name = undefined;
    }
    db.getHiscores(res, constant.CABBAGE, skill, rank, name);
});

module.exports = router;
