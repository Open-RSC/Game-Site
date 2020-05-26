const express = require('express');
const router = express.Router();
const db = require('../db');
const constant = require('../constant');
const helper = require('../helper');

router.get('/', (req, res, next) => {
    db.homepageStatistics(res, constant.OPENRSC, 'openrsc');
});

router.get('/hiscores', async (req, res, next) => {
    const skill = helper.validateSkill(req.query.skill);
    const result = await db.getHiscores(req, res, constant.OPENRSC, skill);
    res.render('hiscores', result);
});

router.post('/hiscores', async (req, res, next) => {
    const skill = helper.validateSkill(req.query.skill);
    const rank = helper.validateRank(req.body.rank);
    let name = helper.validateName(req.body.name);
    if (!isNaN(rank) && name !== undefined) {
        name = undefined;
    }
    const result = await db.getHiscores(req, res, constant.OPENRSC, skill, rank, name);
    res.render('hiscores', result);
});

router.get('/player/:username', async (req, res, next) => {
    const username = helper.validateName(req.params.username);
    const result = await db.getPlayerByName(req, constant.OPENRSC, username);
    if (result === undefined) {
        res.redirect('../hiscores');
    }
    else {
        res.render('player', result);
    }
});

module.exports = router;
