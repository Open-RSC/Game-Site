const { Sequelize, DataTypes, Op } = require('sequelize');
const constant = require('./constant');
const helper = require('./helper');

// Connect to database(s)

const openrsc = new Sequelize(
    constant.OPENRSC, constant.username, constant.password,
    {
        host: constant.host,
        port: constant.port,
        dialect: constant.architecture,
        define: {
            timestamps: false
        },
        logging: false
    }
);
(async () => {
    try {
        await openrsc.authenticate();
        console.log("Connected to database: " + constant.OPENRSC);
    }
    catch (err) {
        console.error("Failed to connect to database: " + constant.OPENRSC);
        console.error(err);
    }
})();

const cabbage = new Sequelize(
    constant.CABBAGE, constant.username, constant.password,
    {
        host: constant.host,
        port: constant.port,
        dialect: constant.architecture,
        define: {
            timestamps: false
        },
        logging: false
    }
);
(async () => {
    try {
        await cabbage.authenticate();
        console.log("Connected to database: " + constant.CABBAGE);
    }
    catch (err) {
        console.error("Failed to connect to database: " + constant.CABBAGE);
        console.error(err);
    }
})();

/* Player Specific Model Initialization */

// Set up experience models for querying
const experience = {
    openrsc: openrsc.define('experience',
        constant.getExperience(constant.OPENRSC),
        { freezeTableName: true }
    ),
    cabbage: cabbage.define('experience',
        constant.getExperience(constant.CABBAGE),
        { freezeTableName: true }
    )
}

// Set up Player model(s) for querying
const players = {
    openrsc: openrsc.define('players', constant.playerDetails, { freezeTableName: true }),
    cabbage: cabbage.define('players', constant.playerDetails, { freezeTableName: true })
}

const player_cache = {
    openrsc: openrsc.define('player_cache', constant.playerCacheDetails, { freezeTableName: true }),
    cabbage: cabbage.define('player_cache', constant.playerCacheDetails, { freezeTableName: true })
}

// Set up relationships.
players.openrsc.hasOne(experience.openrsc, {foreignKey: 'playerID'});
players.cabbage.hasOne(experience.cabbage, {foreignKey: 'playerID'});
experience.openrsc.belongsTo(players.openrsc, {foreignKey: 'playerID', targetKey: 'id'});
experience.cabbage.belongsTo(players.cabbage, {foreignKey: 'playerID', targetKey: 'id'});
players.openrsc.hasMany(player_cache.openrsc, {foreignKey: 'playerID'});
players.cabbage.hasMany(player_cache.cabbage, {foreignKey: 'playerID'});


/* Clans */
const clans = cabbage.define('clan', constant.clanDetails, { freezeTableName: true })
const clan_players = cabbage.define('clan_players', constant.clanPlayersDetails, { freezeTableName: true });

players.cabbage.belongsTo(clan_players, {foreignKey: 'username', targetKey: 'username'});
clan_players.belongsTo(clans, {foreignKey: 'clan_id', targetKey: 'id'});


/* Item Specific Model Initialization */

const inventory = {
    openrsc: openrsc.define('invitems', constant.inventoryItemDetails, { freezeTableName: true }),
    cabbage: cabbage.define('invitems', constant.inventoryItemDetails, { freezeTableName: true })
};

const bank = {
    openrsc: openrsc.define('bank', constant.bankItemDetails, { freezeTableName: true }),
    cabbage: cabbage.define('bank', constant.bankItemDetails, { freezeTableName: true })
};

const itemstatuses = {
    openrsc: openrsc.define('itemstatuses', constant.itemStatusesDetails, { freezeTableName: true }),
    cabbage: cabbage.define('itemstatuses', constant.itemStatusesDetails, { freezeTableName: true })
};

itemstatuses.openrsc.belongsTo(inventory.openrsc, {foreignKey: 'itemID'});
itemstatuses.cabbage.belongsTo(inventory.cabbage, {foreignKey: 'itemID'});

itemstatuses.openrsc.belongsTo(bank.openrsc, {foreignKey: 'itemID'});
itemstatuses.cabbage.belongsTo(bank.cabbage, {foreignKey: 'itemID'});

inventory.openrsc.belongsTo(players.openrsc, {foreignKey: 'playerID', targetKey: 'id'});
inventory.cabbage.belongsTo(players.cabbage, {foreignKey: 'playerID', targetKey: 'id'});

bank.openrsc.belongsTo(players.openrsc, {foreignKey: 'playerID', targetKey: 'id'});
bank.cabbage.belongsTo(players.cabbage, {foreignKey: 'playerID', targetKey: 'id'});

const pool = {
    openrsc: openrsc,
    cabbage: cabbage
}

exports.homepageStatistics = async (res, type) => {
    try {
        let result = {
            online: await players[type].count({ where: { online: 1 } }),
            created: await players[type].count({ where: { creation_date: { [Op.gt]: (Math.round(Date.now() / 1000) - 86400) } } }),
            last: await players[type].count({ where: { login_date: { [Op.gt]: (Math.round(Date.now() / 1000) - 172800) } } }),
            unique: await players[type].count({ distinct: true, col: 'creation_ip' }),
            total: await players[type].count()
        };
        return result;
    }
    catch (err) {
        console.error(err);
        return {
            online: undefined,
            created: undefined,
            last: undefined,
            unique: undefined,
            total: undefined
        };
    }
}

const getOverall = async (req, res, type, rank, name, ironman) => {
    let pageContent = {
        csrfToken: req.csrfToken(),
        server: "/" + type,
        skill: 'Overall'
    };
    const rankOffset = type === constant.CABBAGE ? 10 : 8;
    try {
        if (rank === undefined || isNaN(rank) || rank < rankOffset) {
            rank = rankOffset;
        }

        let combined = await players[type].findAll({
            raw: true,
            include: [
                { model: experience[type] }
            ],
            where: {
                banned: 0,
                group_id: {
                    [Op.gte]: 10
                },
                iron_man: ironman
            }
        });

        combined = Object.keys(combined).sort((a, b) => {
            return combined[b].skill_total - combined[a].skill_total || combined[b].totals - combined[a].totals;
        })
        .map(key => combined[key]);

        // Find the rank
        if (name !== undefined) {
            for (let x in combined) {
                if (combined[x].username.toLowerCase() === name.toLowerCase()) {
                    rank = parseInt(x) + 1;
                    break;
                }
            }
        }

        combined = combined.slice(rank-rankOffset,rank+rankOffset)
        
        // Calculate the total experience
        Object.keys(combined).forEach((user) => {
            combined[user].totals = 0;
            constant.getSkills(type).forEach((skill) => {
                combined[user].totals += combined[user]['experience.' + skill];
            });
        });

        pageContent.hiscores = [];
        let i = 1;
        if (rank !== undefined && rank > rankOffset - 1) {
            i = rank - (rankOffset - 1);
        }
        combined.forEach((element) => {
            thisHiscore = {
                rank: i,
                username: element.username,
                skill: element.skill_total,
                experience: Math.floor(element.totals / 4)
            }
            pageContent.hiscores.push(thisHiscore);
            i++;
        });
    }
    catch (err) {
        console.error(err);
        pageContent.hiscores = [
            {
                rank: 1,
                username: 'fake_user',
                skill: 99,
                experience: 200000000
            }
        ];
    }

    return pageContent;
}

const getSkill = async (req, res, type, skill, rank, name, ironman) => {
    let pageContent = {
        csrfToken: req.csrfToken(),
        server: "/" + type,
        skill: skill[0].toUpperCase() + skill.substr(1)
    };

    const rankOffset = type === constant.CABBAGE ? 10 : 8;
    try {
        if (rank === undefined || isNaN(rank) || rank < rankOffset) {
            rank = rankOffset;
        }
        let combined = await players[type].findAll({
            raw: true,
            include: [
                { model: experience[type], attributes: [skill] }
            ],
            where: {
                banned: 0,
                group_id: {
                    [Op.gte]: 10
                },
                iron_man: ironman
            }
        });

        // Grab player_cache to ensure we filter out the hiscore_opt flagged players
        let cache_values = await player_cache[type].findAll({
            raw: true,
            where: {
                key: 'hiscore_opt'
            },
            attributes: [
                'playerID'
            ]
        });
        cache_values = Object.values(cache_values).map(val => val.playerID);

        combined = Object.keys(combined).sort((a, b) => {
            return constant.experienceToLevel(combined[b]['experience.' + skill]) - constant.experienceToLevel(combined[a]['experience.' + skill])
                || combined[b]['experience.' + skill] - combined[a]['experience.' + skill]; })
        .map(key => combined[key])
        .filter(value => !cache_values.includes(value.id));

        // Find the rank.
        if (name !== undefined) {
            for (let x in combined) {
                if(combined[x].username.toLowerCase() === name.toLowerCase()) {
                    rank = parseInt(x) + 1;
                    break;
                }
            }
        }

        combined = combined.slice(rank-rankOffset,rank+rankOffset)

        pageContent.hiscores = [];
        let i = 1;
        if (rank !== undefined && rank > rankOffset - 1) {
            i = rank - (rankOffset - 1);
        }
        combined.forEach(element => {
            thisHiscore = {
                rank: i,
                username: element.username,
                skill: constant.experienceToLevel(parseInt(element['experience.' + skill])),
                experience: Math.floor(parseInt(element['experience.' + skill]) / 4)
            }
            pageContent.hiscores.push(thisHiscore);
            i++;
        });
    }
    catch (err) {
        console.error(err);
        pageContent.hiscores = [
            {
                rank: 1,
                username: 'fake_user',
                skill: 99,
                experience: 200000000
            }
        ];
    }

    return pageContent;
}

exports.getHiscores = async (req, res, type, skill, rank, name, ironman) => {
    try {
        let skills = constant.getSkills(type);
        if (skill === 'fighting') {
            skill = 'hits';
        }
        if (!skills.includes(skill)) {
            skill = 'overall';
        }
        if (skill === undefined || skill === '' || skill === 'overall') {
            return await getOverall(req, res, type, rank, name, ironman);
        }
        else {
            return await getSkill(req, res, type, skill, rank, name, ironman);
        }
    }
    catch (err) {
        console.log(err);
        res.status(404).send("Unable to find result.");
    }
}

exports.getOnline = async () => {
    try {
        let openrsc = await players[constant.OPENRSC].count({ where: { online: 1 } });
        let cabbage = await players[constant.CABBAGE].count({ where: { online: 1 } });
        return {
            openrsc: openrsc,
            cabbage: cabbage
        };
    }
    catch (err) {
        console.error(err);
        return {
            openrsc: undefined,
            cabbage: undefined
        };
    }
}

exports.getPlayerByName = async (req, type, username) => {
    try {
        let include = [{
            model: experience[type]
        }, {
            model: player_cache[type],
            attributes: [['value', 'arrav_gang']],
            where: {
                'key': 'arrav_gang'
            },
            required: false
        }];
        if (type === constant.CABBAGE) {
            include = include.concat([{
                model: clan_players,
                include: {
                    model: clans,
                    attributes: ['name', 'tag'],
                    required: false
                }
            }]);
        }

        let player = await players[type].findOne({
            raw: true,
            include: include,
            where: {
                username: username
            }
        });
        if (player === undefined || player === null) {
            return undefined;
        }

        let xp_mode;
        if(type === constant.CABBAGE) {
            xp_mode = await player_cache[type].findOne({
                attributes: [['value', 'xp_mode']],
                where: {
                    playerID: player.id,
                    'key': 'onexp_mode'
                }
            });
        }

        let skills = constant.getSkills(type);
        let total = Object.values(skills).reduce((a, b) => a + player['experience.' + b], 0);
        let exps = await experience[type].findAll({
            raw: true,
            include: {
                model: players[type],
                required: true
            },
            where: {
                '$player.group_id$': {
                    [Op.gte]: 10
                },
                '$player.iron_man$': player.iron_man,
                '$player.banned$': 0
            }
        });

        let totalRank = 1;
        for (let x in exps) {
            delete exps[x].playerId;
            const currSkillTotal = skills.map(sk => constant.experienceToLevel(exps[x][sk]))
                .reduce((a, b) => a + b);
            const currTotalExp = skills.reduce((a, b) => a + exps[x][b], 0);
            if (currSkillTotal > player.skill_total) {
                totalRank++;
            }
            else if (currTotalExp > total && currSkillTotal > player.skill_total) {
                totalRank++;
            }
        }

        let hiscores = [['Skill Total', player.skill_total, Math.floor(total / 4), totalRank]];
        Object.values(skills).forEach((element) => {
            let rank = 1;
            exps = Object.keys(exps).sort((a, b) => {
                return exps[b][element] - exps[a][element];
            })
            .map(key => exps[key]);
            for (let x in exps) {
                if(exps[x].playerID === player.id) {
                    rank = parseInt(x) + 1;
                    break;
                }
            }
            hiscores.push([
                element[0].toUpperCase() + element.substr(1),
                constant.experienceToLevel(player['experience.' + element]),
                Math.floor(parseInt(player['experience.' + element]) / 4),
                rank
            ]);
        });

        const ironman = player.iron_man === 1 ? "Normal"
            : player.iron_man === 2 ? "Ultimate"
            : player.iron_man === 3 ? "Hardcore" : undefined;
        const experience_rate = type !== constant.CABBAGE ? undefined
            : xp_mode !== null ? '1x'
            : '5x';
        return {
            csrfToken: req.csrfToken(),
            server: "/" + type,
            username: player.username,
            hiscores: hiscores,
            combat: player.combat,
            quest_points: player.quest_points,
            ironman: ironman,
            clan: player['clan_player.clan.name'] !== null ? player['clan_player.clan.name'] : undefined,
            clan_tag: player['clan_player.clan.tag'] !== null ? player['clan_player.clan.tag'] : undefined,
            clan_rank: player['clan_player.rank'] !== null ? player['clan_player.rank'] : undefined,
            experience_rate:  experience_rate,
            player_kills: player.kills,
            npc_kills: player.npc_kills,
            deaths: player.deaths,
            arrav_gang: player['player_caches.arrav_gang'] !== null ? parseInt(player['player_caches.arrav_gang']) : undefined
        }
    }
    catch (err) {
        console.error(err);
        return {
            csrfToken: req.csrfToken(),
            server: "/" + type,
            username: 'fake_user',
            hiscores: [['Awesomeness', 99, 200000000, 1]]
        }
    }
};

exports.getData = async (req, type, itemname) => {
    if (itemname === undefined) return itemname;
    try {
        // Grab all items like provided name
        let names = helper.fuzzysearch(itemname);
        let namesAndIds = helper.namesToIds(names, type);
        let items = await itemstatuses[type].findAll({
            raw: true,
            include: [{
                model: bank[type],
                include: {
                    model: players[type],
                    attributes: [],
                    required: true
                },
                attributes: []
            }, {
                model: inventory[type],
                include: {
                    model: players[type],
                    attributes: [],
                    required: true
                },
                attributes: []
            }],
            where: {
                catalogID: {
                    [Op.in]: Object.values(namesAndIds).map(def => def.id)
                },
                [Op.or]: [
                    {[Op.and]: [
                        {'$bank.player.banned$': 0},
                        {'$bank.player.group_id$': {
                            [Op.gte]: 10
                        }},
                        {'$bank.player.iron_man$' : 0}
                    ]},
                    {[Op.and]: [
                        {'$invitem.player.banned$': 0},
                        {'$invitem.player.group_id$': {
                            [Op.gte]: 10
                        }},
                        {'$invitem.player.iron_man$' : 0}
                    ]}
                ]
            }
        });

        items.forEach(element => {
            namesAndIds.forEach(value => {
                if (value.id == element.catalogID) {
                    value.amount += element.amount;
                }
            });
        });
        namesAndIds.sort((a, b) => {
            return b.amount - a.amount;
        });
        return namesAndIds;
    }
    catch (err) {
        console.error(err);
        return undefined;
    }
};
