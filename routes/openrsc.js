const express = require('express');
const router = express.Router();
const db = require('../db');
const constant = require('../constant');
const helper = require('../helper');

const server = constant.OPENRSC;

router.get('/', async (req, res, next) => {
    let result = await db.homepageStatistics(res, server);
    result.page_name = "OpenRSC - An authentic client with minor quality of life features. | Open RuneScape Classic";
    res.render(constant.OPENRSC, result);
});

router.get('/hiscores', async (req, res, next) => {
    const skill = helper.validateSkill(req.query.skill);
    const rank = helper.validateRank(req.query.rank);
    const highlight = parseInt(req.query.highlight) === 1;
    const result = await db.getHiscores(req, res, server, skill, rank, undefined, 0);
    result.skills = constant.getSkills(server);
    result.skills.unshift('overall');
    result.skills[1] = 'fighting';
    result.page_name = "OpenRSC - Hiscores | Open RuneScape Classic";
    result.description = "OpenRSC - Hiscores | Runescape Classic with custom content and QoL additions. | Open RuneScape Classic";
    result.server_name = "OpenRSC";
    result.highlighted = highlight ? result.rank : -1;
    res.render('hiscores', result);
});

router.post('/hiscores', async (req, res, next) => {
    const skill = helper.validateSkill(req.query.skill);
    const rank = helper.validateRank(req.body.rank);
    let name = helper.validateName(req.body.name);
    if (!isNaN(rank) && name !== undefined) {
        name = undefined;
    }
    const result = await db.getHiscores(req, res, server, skill, rank, name, 0);
    if (result.hiscores === []) {
        return res.redirect('/hiscores');
    }
    result.skills = constant.getSkills(server);
    result.skills.unshift('overall');
    result.skills[1] = 'fighting';
    result.page_name = "OpenRSC - Hiscores | Open RuneScape Classic";
    result.description = "OpenRSC - Hiscores | Runescape Classic with custom content and QoL additions. | Open RuneScape Classic";
    result.server_name = "OpenRSC";
    result.highlighted = result.rank;
    res.render('hiscores', result);
});

router.get('/player/:username', async (req, res, next) => {
    const username = helper.validateName(req.params.username);
    const result = await db.getPlayerByName(req, server, username);
    if (result === undefined) {
        return res.redirect('/hiscores');
    }
    result.server = '/openrsc';
    result.page_name = "OpenRSC - Players | " + result.username + " | Open RuneScape Classic";
    result.description = "OpenRSC - Players | " + result.username + " | Runescape Classic with custom content and QoL additions. | Open RuneScape Classic";
    res.render('player', result);
});

module.exports = router;
