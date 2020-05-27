const express = require('express');
const router = express.Router();
const db = require('../db');
const constant = require('../constant');
const helper = require('../helper');

const server = constant.CABBAGE;

router.get('/', (req, res, next) => {
    db.homepageStatistics(res, server, 'cabbage');
});

router.get('/hiscores', async (req, res, next) => {
    const skill = helper.validateSkill(req.query.skill);
    const result = await db.getHiscores(req, res, server, skill);
    result.skills = constant.getSkills(server);
    result.skills.unshift('overall');
    result.page_name = "RSC Cabbage - Hiscores | Open RuneScape Classic";
    res.render('hiscores', result);
});

router.post('/hiscores', async (req, res, next) => {
    const skill = helper.validateSkill(req.query.skill);
    const rank = helper.validateRank(req.body.rank);
    let name = helper.validateName(req.body.name);
    if (!isNaN(rank) && name !== undefined) {
        name = undefined;
    }
    const result = await db.getHiscores(req, res, server, skill, rank, name);
    result.skills = constant.getSkills(server);
    result.skills.unshift('overall');
    result.page_name = "RSC Cabbage - Hiscores | Open RuneScape Classic";
    res.render('hiscores', result);
});

router.get('/player/:username', async (req, res, next) => {
    const username = helper.validateName(req.params.username);
    const result = await db.getPlayerByName(req, server, username);
    if (result === undefined) {
        res.redirect('../hiscores');
    }
    else {
        result.page_name = "RSC Cabbage - Players | " + username + " | Open RuneScape Classic";
        res.render('player', result);
    }
});

module.exports = router;
