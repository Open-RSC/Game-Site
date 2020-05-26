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
let customExperience = constant.getExperience();
customExperience.runecraft = {
    type: DataTypes.INTEGER,
    allowNull: false
}
customExperience.harvesting = {
    type: DataTypes.INTEGER,
    allowNull: false
}
const experience = {
    openrsc: openrsc.define('experience', constant.getExperience(), { freezeTableName: true }),
    cabbage: cabbage.define('experience', customExperience, { freezeTableName: true })
}

const pool = {
    openrsc: openrsc,
    cabbage: cabbage
}

exports.homepageStatistics = async (res, type, page) => {
    res.render(page, {
        online: await players[type].count({ where: { online: 1 } }),
        created: await players[type].count({ where: { creation_date: { [Op.gt]: (Math.round(Date.now() / 1000) - 86400) } } }),
        last: await players[type].count({ where: { creation_date: { [Op.gt]: (Math.round(Date.now() / 1000) - 172800) } } }),
        unique: await players[type].count({ distinct: true, col: 'creation_ip' }),
        total: await players[type].count(),
        cumulative: 0
    });
}

const getOverall = async (res, type, rank, name) => {
    if (rank === undefined || isNaN(rank) || rank < 8) {
        rank = 8;
    }
    const totals = await players[type].findAll({
        raw: true,
    });
    const exps = await experience[type].findAll({ raw: true,
        attributes: [[pool[type].literal('playerID AS id, ' + constant.totalExperienceString(type)), 'totals']]
    });
    let combined = helper.joinById(totals, exps);
    combined = Object.keys(combined).sort((a, b) => {
        return combined[b].totals - combined[a].totals;
    }).map(key => combined[key]);
    if (name !== undefined) {
        for (let x in combined) {
            if(combined[x].username === name) {
                rank = parseInt(x) + 1;
                break;
            }
        }
    }

    combined = combined.slice(rank-8,rank+8)

    let hiscores = [];
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
        hiscores.push(thisHiscore);
        i++;
    });
    res.render('hiscores', {
        server: "/" + type,
        skill: 'Overall',
        page_name: type == constant.CABBAGE ? 'RSC Cabbage' : 'OpenRSC',
        hiscores: hiscores
    });
}

const getSkill = async (res, type, skill, rank, name) => {
    if (rank === undefined || isNaN(rank) || rank < 8) {
        rank = 8;
    }
    const playerData = await players[type].findAll({
        raw: true,
    });
    const exps = await experience[type].findAll({ raw: true,
        attributes: [[pool[type].literal('playerID AS id, ' + skill), 'totals']]
    });
    let combined = helper.joinById(playerData, exps);
    combined = Object.keys(combined).sort((a, b) => {
        return combined[b].totals - combined[a].totals;
    }).map(key => combined[key]);
    if (name !== undefined) {
        for (let x in combined) {
            if(combined[x].username === name) {
                rank = parseInt(x) + 1;
                break;
            }
        }
    }

    combined = combined.slice(rank-8,rank+8)

    let hiscores = [];
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
        hiscores.push(thisHiscore);
        i++;
    });
    res.render('hiscores', {
        server: "/" + type,
        page_name: type == constant.CABBAGE ? 'RSC Cabbage' : 'OpenRSC',
        skill: skill[0].toUpperCase() + skill.substr(1),
        hiscores: hiscores
    });
}

exports.getHiscores = (res, type, skill, rank, name) => {
    let skills = constant.possibleSkills.slice();
    if (type === constant.CABBAGE) {
        skills = skills.concat(['runecraft', 'harvesting']);
    }
    if (!skills.includes(skill)) {
        skill = 'overall';
    }
    try {
        if (skill === undefined || skill === '' || skill === 'overall') {
            getOverall(res, type, rank, name);
        }
        else {
            getSkill(res, type, skill, rank, name);
        }
    }
    catch (err) {
        console.log(err);
        res.status(404).send("Unable to find result.");
    }
}

exports.getOnline = async (res, callback) => {
    let openrsc = await players[constant.OPENRSC].count({ where: { online: 1 } });
    let cabbage = await players[constant.CABBAGE].count({ where: { online: 1 } });
    return {
        openrsc: openrsc,
        cabbage: cabbage
    };
}

exports.pool = pool;
