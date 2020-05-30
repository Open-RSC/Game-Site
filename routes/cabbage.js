const express = require('express');
const router = express.Router();
const db = require('../db');
const constant = require('../constant');
const helper = require('../helper');

const server = constant.CABBAGE;

router.get('/', async (req, res, next) => {
    let result = await db.homepageStatistics(res, server);
    result.page_name = "RSC Cabbage - Runescape Classic with custom content and QoL additions. | Open RuneScape Classic";
    res.render(constant.CABBAGE, result);
});

router.get('/hiscores', async (req, res, next) => {
    const skill = helper.validateSkill(req.query.skill);
    const result = await db.getHiscores(req, res, server, skill, undefined, undefined, 0);
    result.skills = constant.getSkills(server);
    result.skills.unshift('overall');
    result.page_name = "RSC Cabbage - Hiscores | Open RuneScape Classic";
    result.server_name = "RSC Cabbage";
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
    result.page_name = "RSC Cabbage - Hiscores | Open RuneScape Classic";
    result.server_name = "RSC Cabbage";
    res.render('hiscores', result);
});

router.get('/hiscores/ironman', async (req, res, next) => {
    const skill = helper.validateSkill(req.query.skill);
    const result = await db.getHiscores(req, res, server, skill, undefined, undefined, 1);
    result.skills = constant.getSkills(server);
    result.skills.unshift('overall');
    result.page_name = "RSC Cabbage - Ironman Hiscores | Open RuneScape Classic";
    result.server_name = "RSC Cabbage";
    result.ironman = "ironman";
    res.render('hiscores', result);
});

router.post('/hiscores/ironman', async (req, res, next) => {
    const skill = helper.validateSkill(req.query.skill);
    const rank = helper.validateRank(req.body.rank);
    let name = helper.validateName(req.body.name);
    if (!isNaN(rank) && name !== undefined) {
        name = undefined;
    }
    const result = await db.getHiscores(req, res, server, skill, rank, name, 1);
    if (result.hiscores === []) {
        return res.redirect('../../hiscores');
    }
    result.skills = constant.getSkills(server);
    result.skills.unshift('overall');
    result.page_name = "RSC Cabbage - Ironman Hiscores | Open RuneScape Classic";
    result.server_name = "RSC Cabbage";
    result.ironman = "ironman";
    res.render('hiscores', result);
});

router.get('/hiscores/ultimate-ironman', async (req, res, next) => {
    const skill = helper.validateSkill(req.query.skill);
    const result = await db.getHiscores(req, res, server, skill, undefined, undefined, 2);
    result.skills = constant.getSkills(server);
    result.skills.unshift('overall');
    result.page_name = "RSC Cabbage - Ultimate Ironman Hiscores | Open RuneScape Classic";
    result.server_name = "RSC Cabbage";
    result.ironman = "ultimate-ironman";
    res.render('hiscores', result);
});

router.post('/hiscores/ultimate-ironman', async (req, res, next) => {
    const skill = helper.validateSkill(req.query.skill);
    const rank = helper.validateRank(req.body.rank);
    let name = helper.validateName(req.body.name);
    if (!isNaN(rank) && name !== undefined) {
        name = undefined;
    }
    const result = await db.getHiscores(req, res, server, skill, rank, name, 2);
    if (result.hiscores === []) {
        return res.redirect('../../hiscores');
    }
    result.skills = constant.getSkills(server);
    result.skills.unshift('overall');
    result.page_name = "RSC Cabbage - Ultimate Ironman Hiscores | Open RuneScape Classic";
    result.server_name = "RSC Cabbage";
    result.ironman = "ultimate-ironman";
    res.render('hiscores', result);
});

router.get('/hiscores/hardcore-ironman', async (req, res, next) => {
    const skill = helper.validateSkill(req.query.skill);
    const result = await db.getHiscores(req, res, server, skill, undefined, undefined, 3);
    result.skills = constant.getSkills(server);
    result.skills.unshift('overall');
    result.page_name = "RSC Cabbage - Hardcore Ironman Hiscores | Open RuneScape Classic";
    result.server_name = "RSC Cabbage";
    result.ironman = "hardcore-ironman";
    res.render('hiscores', result);
});

router.post('/hiscores/hardcore-ironman', async (req, res, next) => {
    const skill = helper.validateSkill(req.query.skill);
    const rank = helper.validateRank(req.body.rank);
    let name = helper.validateName(req.body.name);
    if (!isNaN(rank) && name !== undefined) {
        name = undefined;
    }
    const result = await db.getHiscores(req, res, server, skill, rank, name, 3);
    if (result.hiscores === []) {
        return res.redirect('../../hiscores');
    }
    result.skills = constant.getSkills(server);
    result.skills.unshift('overall');
    result.page_name = "RSC Cabbage - Hardcore Ironman Hiscores | Open RuneScape Classic";
    result.server_name = "RSC Cabbage";
    result.ironman = "hardcore-ironman";
    res.render('hiscores', result);
});

router.get('/player/:username', async (req, res, next) => {
    const username = helper.validateName(req.params.username);
    const result = await db.getPlayerByName(req, server, username);
    if (result === undefined) {
        return res.redirect('../hiscores');
    }
    result.page_name = "RSC Cabbage - Players | " + username + " | Open RuneScape Classic";
    res.render('player', result);
});

module.exports = router;
