const {Sequelize, DataTypes, Op} = require('sequelize');
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
    } catch (err) {
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
    } catch (err) {
        console.error("Failed to connect to database: " + constant.CABBAGE);
        console.error(err);
    }
})();

const uranium = new Sequelize(
    constant.URANIUM, constant.username, constant.password,
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
        await uranium.authenticate();
        console.log("Connected to database: " + constant.URANIUM);
    } catch (err) {
        console.error("Failed to connect to database: " + constant.URANIUM);
        console.error(err);
    }
})();

const coleslaw = new Sequelize(
    constant.COLESLAW, constant.username, constant.password,
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
        await coleslaw.authenticate();
        console.log("Connected to database: " + constant.COLESLAW);
    } catch (err) {
        console.error("Failed to connect to database: " + constant.COLESLAW);
        console.error(err);
    }
})();

/* Player Specific Model Initialization */

// Set up experience models for querying
const experience = {
    openrsc: openrsc.define('experience',
        constant.getExperience(constant.OPENRSC),
        {freezeTableName: true}
    ),
    cabbage: cabbage.define('experience',
        constant.getExperience(constant.CABBAGE),
        {freezeTableName: true}
    ),
    uranium: uranium.define('experience',
        constant.getExperience(constant.URANIUM),
        {freezeTableName: true}
    ),
    coleslaw: coleslaw.define('experience',
        constant.getExperience(constant.COLESLAW),
        {freezeTableName: true}
    )
}

// Set up Player model(s) for querying
const players = {
    openrsc: openrsc.define('players', constant.playerDetails, {freezeTableName: true}),
    cabbage: cabbage.define('players', constant.playerDetails, {freezeTableName: true}),
    uranium: uranium.define('players', constant.playerDetails, {freezeTableName: true}),
    coleslaw: coleslaw.define('players', constant.playerDetails, {freezeTableName: true})
}

const player_cache = {
    openrsc: openrsc.define('player_cache', constant.playerCacheDetails, {freezeTableName: true}),
    cabbage: cabbage.define('player_cache', constant.playerCacheDetails, {freezeTableName: true}),
    uranium: uranium.define('player_cache', constant.playerCacheDetails, {freezeTableName: true}),
    coleslaw: coleslaw.define('player_cache', constant.playerCacheDetails, {freezeTableName: true})
}

// Set up relationships.
players.openrsc.hasOne(experience.openrsc, {foreignKey: 'playerID'});
players.cabbage.hasOne(experience.cabbage, {foreignKey: 'playerID'});
experience.openrsc.belongsTo(players.openrsc, {foreignKey: 'playerID', targetKey: 'id'});
experience.cabbage.belongsTo(players.cabbage, {foreignKey: 'playerID', targetKey: 'id'});
players.openrsc.hasMany(player_cache.openrsc, {foreignKey: 'playerID'});
players.cabbage.hasMany(player_cache.cabbage, {foreignKey: 'playerID'});


/* Clans */
const clans = cabbage.define('clan', constant.clanDetails, {freezeTableName: true})
const clan_players = cabbage.define('clan_players', constant.clanPlayersDetails, {freezeTableName: true});

players.cabbage.belongsTo(clan_players, {foreignKey: 'username', targetKey: 'username'});
clan_players.belongsTo(clans, {foreignKey: 'clan_id', targetKey: 'id'});


/* Item Specific Model Initialization */

const inventory = {
    openrsc: openrsc.define('invitems', constant.inventoryItemDetails, {freezeTableName: true}),
    cabbage: cabbage.define('invitems', constant.inventoryItemDetails, {freezeTableName: true}),
    uranium: uranium.define('invitems', constant.inventoryItemDetails, {freezeTableName: true}),
    coleslaw: coleslaw.define('invitems', constant.inventoryItemDetails, {freezeTableName: true})
};

const bank = {
    openrsc: openrsc.define('bank', constant.bankItemDetails, {freezeTableName: true}),
    cabbage: cabbage.define('bank', constant.bankItemDetails, {freezeTableName: true}),
    uranium: uranium.define('bank', constant.bankItemDetails, {freezeTableName: true}),
    coleslaw: coleslaw.define('bank', constant.bankItemDetails, {freezeTableName: true})
};

const equipment = {
    openrsc: openrsc.define('equipped', constant.equipmentDetails, {freezeTableName: true}),
    cabbage: cabbage.define('equipped', constant.equipmentDetails, {freezeTableName: true}),
    uranium: uranium.define('equipped', constant.equipmentDetails, {freezeTableName: true}),
    coleslaw: coleslaw.define('equipped', constant.equipmentDetails, {freezeTableName: true})
};

const itemstatuses = {
    openrsc: openrsc.define('itemstatuses', constant.itemStatusesDetails, {freezeTableName: true}),
    cabbage: cabbage.define('itemstatuses', constant.itemStatusesDetails, {freezeTableName: true}),
    uranium: uranium.define('itemstatuses', constant.itemStatusesDetails, {freezeTableName: true}),
    coleslaw: coleslaw.define('itemstatuses', constant.itemStatusesDetails, {freezeTableName: true})
};

itemstatuses.openrsc.belongsTo(inventory.openrsc, {foreignKey: 'itemID'});
itemstatuses.cabbage.belongsTo(inventory.cabbage, {foreignKey: 'itemID'});
itemstatuses.uranium.belongsTo(inventory.uranium, {foreignKey: 'itemID'});
itemstatuses.coleslaw.belongsTo(inventory.coleslaw, {foreignKey: 'itemID'});

itemstatuses.openrsc.belongsTo(bank.openrsc, {foreignKey: 'itemID'});
itemstatuses.cabbage.belongsTo(bank.cabbage, {foreignKey: 'itemID'});
itemstatuses.uranium.belongsTo(bank.uranium, {foreignKey: 'itemID'});
itemstatuses.coleslaw.belongsTo(bank.coleslaw, {foreignKey: 'itemID'});

itemstatuses.openrsc.belongsTo(equipment.openrsc, {foreignKey: 'itemID'});
itemstatuses.cabbage.belongsTo(equipment.cabbage, {foreignKey: 'itemID'});
itemstatuses.uranium.belongsTo(equipment.uranium, {foreignKey: 'itemID'});
itemstatuses.coleslaw.belongsTo(equipment.coleslaw, {foreignKey: 'itemID'});

inventory.openrsc.belongsTo(players.openrsc, {foreignKey: 'playerID', targetKey: 'id'});
inventory.cabbage.belongsTo(players.cabbage, {foreignKey: 'playerID', targetKey: 'id'});
inventory.uranium.belongsTo(players.uranium, {foreignKey: 'playerID', targetKey: 'id'});
inventory.coleslaw.belongsTo(players.coleslaw, {foreignKey: 'playerID', targetKey: 'id'});

bank.openrsc.belongsTo(players.openrsc, {foreignKey: 'playerID', targetKey: 'id'});
bank.cabbage.belongsTo(players.cabbage, {foreignKey: 'playerID', targetKey: 'id'});
bank.uranium.belongsTo(players.uranium, {foreignKey: 'playerID', targetKey: 'id'});
bank.coleslaw.belongsTo(players.coleslaw, {foreignKey: 'playerID', targetKey: 'id'});

equipment.openrsc.belongsTo(players.openrsc, {foreignKey: 'playerID', targetKey: 'id'});
equipment.cabbage.belongsTo(players.cabbage, {foreignKey: 'playerID', targetKey: 'id'});
equipment.uranium.belongsTo(players.uranium, {foreignKey: 'playerID', targetKey: 'id'});
equipment.coleslaw.belongsTo(players.coleslaw, {foreignKey: 'playerID', targetKey: 'id'});

// Live Feed
const live_feeds = {
    openrsc: openrsc.define('live_feeds', constant.liveFeedsDetails, {freezeTableName: true}),
    cabbage: cabbage.define('live_feeds', constant.liveFeedsDetails, {freezeTableName: true}),
    uranium: uranium.define('live_feeds', constant.liveFeedsDetails, {freezeTableName: true}),
    coleslaw: coleslaw.define('live_feeds', constant.liveFeedsDetails, {freezeTableName: true})
}

const pool = {
    openrsc: openrsc,
    cabbage: cabbage,
    uranium: uranium,
    coleslaw: coleslaw
}

exports.homepageStatistics = async (res, type) => {
    try {
        let result = {
            online: await players[type].count({where: {online: 1}}),
            created: await players[type].count({where: {creation_date: {[Op.gt]: (Math.round(Date.now() / 1000) - 86400)}}}),
            last: await players[type].count({where: {login_date: {[Op.gt]: (Math.round(Date.now() / 1000) - 172800)}}}),
            unique: await players[type].count({distinct: true, col: 'creation_ip'}),
            total: await players[type].count()
        };
        return result;
    } catch (err) {
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
    const rankOffset = type === constant.CABBAGE ? 10 : 8;
    let pageContent = {
        csrfToken: req.csrfToken(),
        server: "/" + type,
        skill: 'Overall',
        rankOffset: rankOffset
    };
    try {
        if (rank === undefined || isNaN(rank) || rank < rankOffset) {
            rank = rankOffset;
        }

        let where = {
            banned: 0,
            group_id: {
                [Op.gte]: constant.GROUP.PLAYER_MOD
            }
        };

        // Set up all normal and ironmen to show for "all" scores.
        if (ironman === 0) {
            where.iron_man = {
                [Op.lte]: 3
            }
        } else if (ironman < 4) {
            where.iron_man = ironman;
        }

        let combined = await players[type].findAll({
            raw: true,
            include: [
                {model: experience[type]}
            ],
            where: where
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

        // Calculate the total experience
        Object.keys(combined).forEach((user) => {
            combined[user].totals = 0;
            constant.getSkills(type).forEach((skill) => {
                combined[user].totals += combined[user]['experience.' + skill];
            });
        });

        // Calculate the total level, since one in db may be outdated
        Object.keys(combined).forEach((user) => {
            combined[user].total_level = 0;
            constant.getSkills(type).forEach((skill) => {
                combined[user].total_level += constant.experienceToLevel(combined[user]['experience.' + skill]);
            });
        });

        combined = Object.keys(combined).sort((a, b) => {
            return combined[b].total_level - combined[a].total_level || combined[b].totals - combined[a].totals;
        })
            .map(key => combined[key])
            .filter(value => !cache_values.includes(value.id));

        // Find the rank
        if (name !== undefined) {
            for (let x in combined) {
                if (combined[x].username.toLowerCase() === name.toLowerCase()) {
                    rank = parseInt(x) + 1;
                    break;
                }
            }
        }
        pageContent.rank = rank;

        combined = combined.slice(rank - rankOffset, rank + rankOffset)

        pageContent.hiscores = [];
        let i = 1;
        if (rank !== undefined && rank > rankOffset - 1) {
            i = rank - (rankOffset - 1);
        }
        combined.forEach((element) => {
            thisHiscore = {
                rank: i,
                username: element.username,
                skill: element.total_level,
                experience: Math.floor(element.totals / 4)
            }
            pageContent.hiscores.push(thisHiscore);
            i++;
        });
    } catch (err) {
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
    const rankOffset = type === constant.CABBAGE ? 10 : 8;
    const displaySkill = skill.toLowerCase() === 'hits' && type == constant.OPENRSC ? "fighting" : skill;
    let pageContent = {
        csrfToken: req.csrfToken(),
        server: "/" + type,
        skill: displaySkill[0].toUpperCase() + displaySkill.substr(1),
        rankOffset: rankOffset
    };

    let where = {
        banned: 0,
        group_id: {
            [Op.gte]: constant.GROUP.PLAYER_MOD
        }
    };

    // Set up all normal and ironmen to show for "all" scores.
    if (ironman === 0) {
        where.iron_man = {
            ironman: {
                [Op.lte]: 3
            }
        }
    } else if (ironman < 4) {
        where.iron_man = ironman;
    }

    try {
        if (rank === undefined || isNaN(rank) || rank < rankOffset) {
            rank = rankOffset;
        }
        let combined = await players[type].findAll({
            raw: true,
            include: [
                {model: experience[type], attributes: [skill]}
            ],
            where: where
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
                || combined[b]['experience.' + skill] - combined[a]['experience.' + skill];
        })
            .map(key => combined[key])
            .filter(value => !cache_values.includes(value.id));

        // Find the rank.
        if (name !== undefined) {
            for (let x in combined) {
                if (combined[x].username.toLowerCase() === name.toLowerCase()) {
                    rank = parseInt(x) + 1;
                    break;
                }
            }
        }
        pageContent.rank = rank;

        combined = combined.slice(rank - rankOffset, rank + rankOffset)

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
    } catch (err) {
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
        } else {
            return await getSkill(req, res, type, skill, rank, name, ironman);
        }
    } catch (err) {
        console.error(err);
        res.status(404).send("Unable to find result.");
    }
}

exports.getOnline = async () => {
    try {
        let openrsc = await players[constant.OPENRSC].count({where: {online: 1}});
        let cabbage = await players[constant.CABBAGE].count({where: {online: 1}});
        let uranium = await players[constant.URANIUM].count({where: {online: 1}});
        let coleslaw = await players[constant.COLESLAW].count({where: {online: 1}});
        return {
            openrsc: openrsc,
            cabbage: cabbage,
            uranium: uranium,
            coleslaw: coleslaw
        };
    } catch (err) {
        console.error(err);
        return {
            openrsc: undefined,
            cabbage: undefined,
            uranium: undefined,
            coleslaw: undefined
        };
    }
}

exports.getPlayers = async () => {
    try {
        let openrsc = await players[constant.OPENRSC].count({distinct: true, col: 'creation_ip'});
        let cabbage = await players[constant.CABBAGE].count({distinct: true, col: 'creation_ip'});
        let uranium = await players[constant.URANIUM].count({distinct: true, col: 'creation_ip'});
        let coleslaw = await players[constant.COLESLAW].count({distinct: true, col: 'creation_ip'});
        return {
            openrsc: openrsc,
            cabbage: cabbage,
            uranium: uranium,
            coleslaw: coleslaw
        };
    } catch (err) {
        console.error(err);
        return {
            openrsc: undefined,
            cabbage: undefined,
            uranium: undefined,
            coleslaw: undefined
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
        if (type === constant.URANIUM) {
            include = include.concat([{
                model: clan_players,
                include: {
                    model: clans,
                    attributes: ['name', 'tag'],
                    required: false
                }
            }]);
        }
        if (type === constant.COLESLAW) {
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
        if (type === constant.CABBAGE) {
            xp_mode = await player_cache[type].findOne({
                attributes: [['value', 'xp_mode']],
                where: {
                    playerID: player.id,
                    'key': 'onexp_mode'
                }
            });
        }
        if (type === constant.URANIUM) {
            xp_mode = await player_cache[type].findOne({
                attributes: [['value', 'xp_mode']],
                where: {
                    playerID: player.id,
                    'key': 'onexp_mode'
                }
            });
        }
        if (type === constant.COLESLAW) {
            xp_mode = await player_cache[type].findOne({
                attributes: [['value', 'xp_mode']],
                where: {
                    playerID: player.id,
                    'key': 'onexp_mode'
                }
            });
        }

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

        let displaySkills = constant.getDisplaySkills(type);
        let skills = constant.getSkills(type);
        let totalXp = Object.values(skills).reduce((a, b) => a + player['experience.' + b], 0);
        let totalLevel = Object.values(skills).reduce((a, b) => a + constant.experienceToLevel(player['experience.' + b]), 0);
        let exps = await experience[type].findAll({
            raw: true,
            include: {
                model: players[type],
                required: true
            },
            where: {
                '$player.group_id$': {
                    [Op.gte]: constant.GROUP.PLAYER_MOD
                },
                '$player.iron_man$': player.iron_man,
                '$player.banned$': 0
            }
        }).filter(value => !cache_values.includes(value.playerID));

        let totalRank = 1;
        let currPlayerId;
        for (let x in exps) {
            currPlayerId = exps[x].playerID;
            delete exps[x].playerId;
            const currSkillTotal = skills.map(sk => constant.experienceToLevel(exps[x][sk]))
                .reduce((a, b) => a + b);
            const currTotalExp = skills.reduce((a, b) => a + exps[x][b], 0);
            if (currSkillTotal > totalLevel) {
                totalRank++;
            } else if (currTotalExp > totalXp && currSkillTotal == totalLevel) {
                totalRank++;
            } else if (currPlayerId < player.id && currTotalExp == totalXp && currSkillTotal == totalLevel) {
                totalRank++;
            }
        }

        let hiscores = [['Overall', totalLevel, Math.floor(totalXp / 4), totalRank]];
        Object.values(displaySkills).forEach((element) => {
            let rank = 1;
            let display = element.toLowerCase() === 'hits' && type == constant.OPENRSC ? "fighting" : element;
            exps = Object.keys(exps).sort((a, b) => {
                return exps[b][element] - exps[a][element];
            })
                .map(key => exps[key]);
            for (let x in exps) {
                if (exps[x].playerID === player.id) {
                    rank = parseInt(x) + 1;
                    break;
                }
            }
            hiscores.push([
                display[0].toUpperCase() + display.substr(1),
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

        let login_string = "Never";
        let time_since_login = Math.floor(Date.now() / 1000) - player.login_date;
        if (player.online === 1) {
            login_string = "Now";
        } else {
            if (time_since_login < 86400) {
                login_string = "< 1 day ago";
            } else if (time_since_login < 172800) {
                login_string = "< 2 days ago";
            } else if (time_since_login < 604800) {
                login_string = "< 1 week ago";
            } else if (time_since_login < 2592000) {
                login_string = "< 30 days ago";
            } else {
                login_string = "Long ago";
            }
        }


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
            experience_rate: experience_rate,
            player_kills: player.kills,
            npc_kills: player.npc_kills,
            deaths: player.deaths,
            arrav_gang: player['player_caches.arrav_gang'] !== null ? parseInt(player['player_caches.arrav_gang']) : undefined,
            last_login: login_string
        }
    } catch (err) {
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
        let include = [{
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
        }];

        if (type === constant.CABBAGE) {
            include = include.concat([{
                model: equipment[type],
                include: {
                    model: players[type],
                    attributes: [],
                    required: true
                },
                attributes: []
            }]);
        }

        // Grab all items like provided name
        let names = helper.fuzzysearch(itemname);
        let namesAndIds = helper.namesToIds(names, type);
        let items = await itemstatuses[type].findAll({
            raw: true,
            include: include,
            where: {
                catalogID: {
                    [Op.in]: Object.values(namesAndIds).map(def => def.id)
                },
                [Op.or]: [
                    {
                        [Op.and]: [
                            {'$bank.player.banned$': 0},
                            {
                                '$bank.player.group_id$': {
                                    [Op.gte]: constant.GROUP.PLAYER_MOD
                                }
                            },
                            {'$bank.player.iron_man$': 0}
                        ]
                    },
                    {
                        [Op.and]: [
                            {'$invitem.player.banned$': 0},
                            {
                                '$invitem.player.group_id$': {
                                    [Op.gte]: constant.GROUP.PLAYER_MOD
                                }
                            },
                            {'$invitem.player.iron_man$': 0}
                        ]
                    },
                    {
                        [Op.and]: [
                            {'$equipped.player.banned$': 0},
                            {
                                '$equipped.player.group_id$': {
                                    [Op.gte]: constant.GROUP.PLAYER_MOD
                                }
                            },
                            {'$equipped.player.iron_man$': 0}
                        ]
                    }
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
    } catch (err) {
        console.error(err);
        return undefined;
    }
};

exports.getClans = async (req, rank) => {
    const rankOffset = 10;
    try {
        if (rank === undefined || isNaN(rank) || rank < rankOffset) {
            rank = rankOffset;
        }

        const clan = await clans.findAll({
            raw: true
        });
        if (clan === undefined || clan === null) {
            return undefined;
        }

        const clanPlayers = await clan_players.findAll({
            raw: true,
            attributes: [['clan_id', 'id'], [Sequelize.fn("COUNT", Sequelize.col("clan_id")), 'count']],
            group: 'clan_id'
        });

        if (clanPlayers.length < 1) {
            return undefined;
        }

        let combined = helper.joinById(clan, clanPlayers);
        combined = Object.values(combined).map(val => {
            return [
                val.name,
                val.tag,
                val.leader,
                val.count
            ]
        }).sort((a, b) => b[3] - a[3])
            .slice(rank - rankOffset, rank + rankOffset);

        return {
            clans: combined,
            rank: rank,
            rankOffset: rankOffset
        }
    } catch (err) {
        console.error(err);
        return undefined;
    }
};

exports.getClan = async (req, clanName) => {
    try {
        const clan = await clans.findOne({
            raw: true,
            where: {
                name: clanName
            }
        });

        if (clan === undefined || clan === null) {
            return undefined;
        }

        let clanPlayers = await players[constant.CABBAGE].findAll({
            raw: true,
            attributes: ['username', 'skill_total', 'combat'],
            include: {
                model: clan_players,
                where: {
                    clan_id: clan.id
                }
            },
            order: [
                ['skill_total', 'DESC']
            ]
        });

        if (clanPlayers.length < 1) {
            return undefined;
        }

        let leader;
        let generals = [];
        let members = [];
        clanPlayers = clanPlayers.map(value => {
            let rank = 'Member';
            if (value['clan_player.rank'] === 1) {
                leader = [
                    'Leader',
                    value.username,
                    value.skill_total,
                    value.combat,
                ];
            } else if (value['clan_player.rank'] === 2) {
                generals.push([
                    'General',
                    value.username,
                    value.skill_total,
                    value.combat,
                ])
            } else {
                members.push([
                    'Member',
                    value.username,
                    value.skill_total,
                    value.combat,
                ])
            }
        });
        return {
            clan_name: clan.name,
            clan_tag: clan.tag,
            member_count: clanPlayers.length,
            leader: leader,
            generals: generals,
            members: members
        }
    } catch (err) {
        console.error(err);
        return undefined;
    }
};

exports.getLiveFeeds = async () => {
    let openrsc_feed = await live_feeds.openrsc.findAll({
        raw: true,
        order: [
            ['time', 'DESC']
        ],
        limit: 2
    });
    let cabbage_feed = await live_feeds.cabbage.findAll({
        raw: true,
        order: [
            ['time', 'DESC']
        ],
        limit: 2
    });
    let uranium_feed = await live_feeds.uranium.findAll({
        raw: true,
        order: [
            ['time', 'DESC']
        ],
        limit: 2
    });
    let coleslaw_feed = await live_feeds.coleslaw.findAll({
        raw: true,
        order: [
            ['time', 'DESC']
        ],
        limit: 2
    });

    openrsc_feed.forEach((ele) => {
        ele.message = ele.message.replace(/<[^>]*>?/gm, '');
        ele.server = 'openrsc';
    });
    cabbage_feed.forEach((ele) => {
        ele.message = ele.message.replace(/<[^>]*>?/gm, '');
        ele.server = 'cabbage';
    });
    uranium_feed.forEach((ele) => {
        ele.message = ele.message.replace(/<[^>]*>?/gm, '');
        ele.server = 'uranium';
    });
    coleslaw_feed.forEach((ele) => {
        ele.message = ele.message.replace(/<[^>]*>?/gm, '');
        ele.server = 'coleslaw';
    });

    let feed = openrsc_feed.concat(cabbage_feed).concat(uranium_feed).concat(coleslaw_feed);

    // Limit to 10
    feed = Object.values(feed).sort((a, b) => {
        return b.time - a.time;
    }).slice(0, feed.length < 8 ? feed.length : 8);

    return feed;
};
