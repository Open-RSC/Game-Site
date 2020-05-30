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
        }
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
        }
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

// Set up Player model(s) for querying
const players = {
    openrsc: openrsc.define('players', constant.playerDetails, { freezeTableName: true }),
    cabbage: cabbage.define('players', constant.playerDetails, { freezeTableName: true })
}

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

const pool = {
    openrsc: openrsc,
    cabbage: cabbage
}

exports.homepageStatistics = async (res, type) => {
    try {
        let result = {
            online: await players[type].count({ where: { online: 1 } }),
            created: await players[type].count({ where: { creation_date: { [Op.gt]: (Math.round(Date.now() / 1000) - 86400) } } }),
            last: await players[type].count({ where: { creation_date: { [Op.gt]: (Math.round(Date.now() / 1000) - 172800) } } }),
            unique: await players[type].count({ distinct: true, col: 'creation_ip' }),
            total: await players[type].count()
        };
        return result;
    }
    catch (err) {
        console.log(err);
        return {
            online: 'Database Offline',
            created: 'Database Offline',
            last: 'Database Offline',
            unique: 'Database Offline',
            total: 'Database Offline'
        };
    }
}

const getOverall = async (req, res, type, rank, name) => {
    let pageContent = {
        csrfToken: req.csrfToken(),
        server: "/" + type,
        skill: 'Overall',
        server_name: type == constant.CABBAGE ? 'RSC Cabbage' : 'OpenRSC',
    };
    try {
        if (rank === undefined || isNaN(rank) || rank < 8) {
            rank = 8;
        }
        const totals = await players[type].findAll({
            raw: true,
        });
        const exps = await experience[type].findAll({ raw: true,
            attributes: [[pool[type].literal('playerID AS id, ' + constant.totalExperienceString(type)), 'totals']]
        });

        // Combine the lists
        let combined = helper.joinById(totals, exps);
        combined = Object.keys(combined).sort((a, b) => {
            return combined[b].skill_total - combined[a].skill_total || combined[b].totals - combined[a].totals;
        })
        .map(key => combined[key])
        .filter(user => parseInt(user.banned) === 0 && user.group_id >= 10);

        //if (type === constant.CABBAGE) {
            combined = combined.filter(user => user.iron_man !== 4);
        //}

        // Find the rank
        if (name !== undefined) {
            for (let x in combined) {
                if (combined[x].username === name) {
                    rank = parseInt(x) + 1;
                    break;
                }
            }
        }

        combined = combined.slice(rank-8,rank+8)

        pageContent.hiscores = [];
        let i = 1;
        if (rank !== undefined && rank > 7) {
            i = rank - 7;
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
        console.log(err);
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

const getSkill = async (req, res, type, skill, rank, name) => {
    let pageContent = {
        csrfToken: req.csrfToken(),
        server: "/" + type,
        server_name: type == constant.CABBAGE ? 'RSC Cabbage' : 'OpenRSC',
        skill: skill[0].toUpperCase() + skill.substr(1)
    };
    try {
        if (rank === undefined || isNaN(rank) || rank < 8) {
            rank = 8;
        }
        const playerData = await players[type].findAll({
            raw: true
        });
        const exps = await experience[type].findAll({ raw: true,
            attributes: [[pool[type].literal('playerID AS id, ' + skill), 'totals']]
        });

        // Combine the experience and player lists.
        let combined = helper.joinById(playerData, exps);
        combined = Object.keys(combined).sort((a, b) => {
            return combined[b].totals - combined[a].totals; })
        .map(key => combined[key])
        .filter(user => parseInt(user.banned) === 0 && user.group_id >= 10);

        //if (type === constant.CABBAGE) {
            combined = combined.filter(user => user.iron_man !== 4);
        //}

        // Find the rank.
        if (name !== undefined) {
            for (let x in combined) {
                if(combined[x].username === name) {
                    rank = parseInt(x) + 1;
                    break;
                }
            }
        }

        if (type === constant.CABBAGE) {
            combined = combined.slice(rank-10,rank+10)
        }
        else {
            combined = combined.slice(rank-8,rank+8)
        }


        pageContent.hiscores = [];
        let i = 1;
        if (rank !== undefined && rank > 7) {
            i = rank - 7;
        }
        combined.forEach(element => {
            thisHiscore = {
                rank: i,
                username: element.username,
                skill: constant.experienceToLevel(parseInt(element.totals)),
                experience: Math.floor(parseInt(element.totals) / 4)
            }
            pageContent.hiscores.push(thisHiscore);
            i++;
        });
    }
    catch (err) {
        console.log(err);
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

exports.getHiscores = async (req, res, type, skill, rank, name) => {
    try {
        let skills = constant.getSkills(type);
        if (skill === 'fighting') {
            skill = 'hits';
        }
        if (!skills.includes(skill)) {
            skill = 'overall';
        }
        if (skill === undefined || skill === '' || skill === 'overall') {
            return await getOverall(req, res, type, rank, name);
        }
        else {
            return await getSkill(req, res, type, skill, rank, name);
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
        console.log(err);
        return {
            openrsc: 'Database Offline',
            cabbage: 'Database Offline'
        };
    }
}

exports.getPlayerByName = async (req, type, username) => {
    try {
        let player = await players[type].findOne({
            raw: true,
            where: {
                username: username
            }
        });
        if (player === undefined || player === null) {
            return undefined;
        }

        let skills = await experience[type].findOne({
            raw: true,
            attributes: {exclude: ['id', 'playerID']},
            where: {
                playerID: player.id
            }
        });
        let total = Object.values(skills).reduce((a, b) => a + b, 0);
        let totalRank = 0;
        let exps = await experience[type].findAll({
            raw: true,
            attributes: {exclude: ['id']}
        });

        for (let x in exps) {
            if (Object.values(exps[x]).reduce((a, b) => a + b, 0) > total) {
                totalRank++;
            }
        }

        let hiscores = [['Skill Total', player.skill_total]];
        Object.keys(skills).forEach((element) => {
            let rank = 1;
            exps = Object.keys(exps).sort((a, b) => {
                return exps[b][element] - exps[a][element];
            }).map(key => exps[key]);
            for (let x in exps) {
                if(exps[x].playerID === player.id) {
                    rank = parseInt(x) + 1;
                    break;
                }
            }

            hiscores.push([
                element[0].toUpperCase() + element.substr(1),
                constant.experienceToLevel(skills[element]),
                Math.floor(parseInt(skills[element]) / 4),
                rank
            ]);
        });

        hiscores[0].push(Math.floor(total / 4));
        hiscores[0].push(totalRank);

        return {
            csrfToken: req.csrfToken(),
            server: "/" + type,
            username: player.username,
            hiscores: hiscores
        }
    }
    catch (err) {
        console.log(err);
        return {
            csrfToken: req.csrfToken(),
            server: "/" + type,
            username: 'fake_user',
            hiscores: [['Awesomeness', 99, 200000000, 1]]
        }
    }
}

exports.pool = pool;
