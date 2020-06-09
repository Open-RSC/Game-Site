const express = require('express');
const router = express.Router();
const db = require('../db');
const constant = require('../constant');
const helper = require('../helper');

const server = constant.CABBAGE;

router.get('/', async (req, res, next) => {
    let result = await db.homepageStatistics(res, server);
    result.page_name = "RSC Cabbage - Runescape Classic with custom content and QoL additions. | Open RuneScape Classic";
    result.description = "RSC Cabbage - Runescape Classic with custom content and QoL additions.";
    res.render(constant.CABBAGE, result);
});

router.get('/hiscores', async (req, res, next) => {
    const skill = helper.validateSkill(req.query.skill);
    const rank = helper.validateRank(req.query.rank);
    const result = await db.getHiscores(req, res, server, skill, rank, undefined, 0);
    result.skills = constant.getSkills(server);
    result.skills.unshift('overall');
    result.rank = rank;
    result.page_name = "RSC Cabbage - Hiscores | Open RuneScape Classic";
    result.server_name = "RSC Cabbage";
    result.description = "RSC Cabbage - Hiscores | Runescape Classic with custom content and QoL additions. | Open RuneScape Classic";
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
    result.rank = rank;
    result.page_name = "RSC Cabbage - Hiscores | Open RuneScape Classic";
    result.description = "RSC Cabbage - Hiscores | Runescape Classic with custom content and QoL additions. | Open RuneScape Classic";
    result.server_name = "RSC Cabbage";
    res.render('hiscores', result);
});

router.get('/hiscores/ironman', async (req, res, next) => {
    const skill = helper.validateSkill(req.query.skill);
    const rank = helper.validateRank(req.query.rank);
    const result = await db.getHiscores(req, res, server, skill, rank, undefined, 1);
    result.skills = constant.getSkills(server);
    result.skills.unshift('overall');
    result.rank = rank;
    result.page_name = "RSC Cabbage - Ironman Hiscores | Open RuneScape Classic";
    result.description = "RSC Cabbage - Ironman Hiscores | Runescape Classic with custom content and QoL additions. | Open RuneScape Classic";
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
        return res.redirect('.');
    }
    result.skills = constant.getSkills(server);
    result.skills.unshift('overall');
    result.page_name = "RSC Cabbage - Ironman Hiscores | Open RuneScape Classic";
    result.description = "RSC Cabbage - Ironman Hiscores | Runescape Classic with custom content and QoL additions. | Open RuneScape Classic";
    result.server_name = "RSC Cabbage";
    result.ironman = "ironman";
    res.render('hiscores', result);
});

router.get('/hiscores/ultimate-ironman', async (req, res, next) => {
    const skill = helper.validateSkill(req.query.skill);
    const rank = helper.validateRank(req.query.rank);
    const result = await db.getHiscores(req, res, server, skill, rank, undefined, 2);
    result.skills = constant.getSkills(server);
    result.skills.unshift('overall');
    result.page_name = "RSC Cabbage - Ultimate Ironman Hiscores | Open RuneScape Classic";
    result.description = "RSC Cabbage - Ultimate Ironman Hiscores | Runescape Classic with custom content and QoL additions. | Open RuneScape Classic";
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
        return res.redirect('.');
    }
    result.skills = constant.getSkills(server);
    result.skills.unshift('overall');
    result.page_name = "RSC Cabbage - Ultimate Ironman Hiscores | Open RuneScape Classic";
    result.description = "RSC Cabbage - Ultimate Ironman Hiscores | Runescape Classic with custom content and QoL additions. | Open RuneScape Classic";
    result.server_name = "RSC Cabbage";
    result.ironman = "ultimate-ironman";
    res.render('hiscores', result);
});

router.get('/hiscores/hardcore-ironman', async (req, res, next) => {
    const skill = helper.validateSkill(req.query.skill);
    const rank = helper.validateRank(req.query.rank);
    const result = await db.getHiscores(req, res, server, skill, rank, undefined, 3);
    result.skills = constant.getSkills(server);
    result.skills.unshift('overall');
    result.page_name = "RSC Cabbage - Hardcore Ironman Hiscores | Open RuneScape Classic";
    result.description = "RSC Cabbage - Hardcore Ironman Hiscores | Runescape Classic with custom content and QoL additions. | Open RuneScape Classic";
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
        return res.redirect('.');
    }
    result.skills = constant.getSkills(server);
    result.skills.unshift('overall');
    result.page_name = "RSC Cabbage - Hardcore Ironman Hiscores | Open RuneScape Classic";
    result.description = "RSC Cabbage - Hardcore Ironman Hiscores | Runescape Classic with custom content and QoL additions. | Open RuneScape Classic";
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
    result.page_name = "RSC Cabbage - Players | " + result.username + " | Open RuneScape Classic";
    result.description = "RSC Cabbage - Players | " + result.username + " | Runescape Classic with custom content and QoL additions. | Open RuneScape Classic";
    res.render('player', result);
});

router.get('/database', async (req, res, next) => {
    res.render('database', {
        csrfToken: req.csrfToken(),
        placeholder_item: constant.itemnames[Math.floor(Math.random() * constant.itemnames.length)],
        page_name: 'RSC Cabbage - Database | Open RuneScape Classic',
        description: "RSC Cabbage - Database | Open RuneScape Classic"
    })
});

router.post('/database', async (req, res, next) => {
    let result;
    if (req.body.itemname !== undefined && req.body.itemname.length > 0) {
        const itemname = helper.validateItem(req.body.itemname);
        result = await db.getData(req, server, itemname);
    }
    if (result === undefined) {
        return res.redirect('.');
    }
    
    res.render('database', {
        csrfToken: req.csrfToken(),
        placeholder_item: constant.itemnames[Math.floor(Math.random() * constant.itemnames.length)],
        page_name: 'RSC Cabbage - Database | Open RuneScape Classic',
        description: "RSC Cabbage - Database | " + itemname + " | Open RuneScape Classic",
        type: 'items',
        items: result
    });
});

router.get('/clans', async (req, res, next) => {
    const rank = helper.validateRank(req.query.rank);
    let result = await db.getClans(req, rank);
    res.render('clan_list', {
        server: '/cabbage',
        page_name: 'RSC Cabbage - Clans | Open RuneScape Classic',
        description: "RSC Cabbage - Clans | A list of all clans. |  Open RuneScape Classic",
        clans: result.clans,
        rankOffset: result.rankOffset,
        rank: result.rank
    });
});

router.get('/clans/:clan', async (req, res, next) => {
    const clan = helper.validateName(req.params.clan);
    let result = await db.getClan(req, clan);
    if (result === undefined) {
        return res.redirect('/cabbage');
    }

    let generalsTotal = result.generals.reduce((a, b) => a + b[2], 0);
    let membersTotal = result.members.reduce((a, b) => a + b[2], 0);

    res.render('clans', {
        server: '/cabbage',
        page_name: 'RSC Cabbage - Clans | ' + result.clan_name + ' | Open RuneScape Classic',
        description: "RSC Cabbage - Clans | " + result.clan_name + " |  Open RuneScape Classic",
        clan_name: result.clan_name,
        clan_tag: result.clan_tag,
        member_count: result.member_count,
        total_skill: membersTotal + generalsTotal + result.leader[2],
        average_skill: Math.floor((membersTotal + generalsTotal + result.leader[2]) / result.member_count),
        leader: result.leader,
        generals: result.generals,
        members: result.members
    });
});

module.exports = router;
