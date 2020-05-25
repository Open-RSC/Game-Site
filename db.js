const mysql = require('mysql');
const q = require('./queries');
const constant = require('./constant');

let pool = mysql.createPoolCluster({
    canRetry: true,
    restoreNodeTimeout: 1000
});
pool.add(constant.OPENRSC, {
    host: constant.host,
    port: constant.port,
    user: constant.username,
    password: constant.password,
    database: constant.OPENRSC,
    multipleStatements: true
});
pool.add(constant.CABBAGE, {
    host: constant.host,
    port: constant.port,
    user: constant.username,
    password: constant.password,
    database: constant.CABBAGE,
    multipleStatements: true
});


exports.getConnection = (type, callback) => {
    if (type == constant.OPENRSC) {
        pool.getConnection(constant.OPENRSC, callback);
    }
    else if (type == constant.CABBAGE) {
        pool.getConnection(constant.CABBAGE, callback);
    }
}

exports.homepageStatistics = (res, type, page) => {
    exports.getConnection(type, (err, connection) => {
        if (err) return console.error(err);
        let query = q.statisticsQuery();
        connection.query(query, (err, rows) => {
            if (err) return console.error(err);
            let online = rows[0][0]["COUNT(*)"];
            let created = rows[1][0]["COUNT(*)"];
            let last = rows[2][0]["COUNT(*)"];
            let unique = rows[3][0]["COUNT(DISTINCT `creation_ip`)"];
            let total = rows[4][0]["COUNT(*)"];
            res.render(page, {
                online: online,
                created: created,
                last: last,
                unique: unique,
                total: total,
                cumulative: 0
            });
            connection.release();
        });
    });
}

const getOverall = (connection, res, type, skills, rank, name) => {
    let query = q.overallQuery(type, rank, name);
    connection.query(query, (err, rows) => {
        if (err) return console.error(err);
        hiscores = [];
        let i = 1;
        if (rank !== undefined && rank > 6) {
            i = rank - 6;
        }
        rows.forEach(element => {
            thisHiscore = {
                rank: i,
                username: element.username,
                skill: element.skill_total,
                experience: 0
            }
            delete element.username;
            delete element.skill_total;
            for (var index in element) {
                if (!element.hasOwnProperty(index)) continue;
                thisHiscore.experience += element[index];
            }
            thisHiscore.experience = Math.floor(thisHiscore.experience / 4);
            hiscores.push(thisHiscore);
            i++;
        });
        res.render('hiscores', {
            server: "/" + type,
            skill: 'Overall',
            page_name: type == constant.CABBAGE ? 'RSC Cabbage' : 'OpenRSC',
            hiscores: hiscores
        });
        connection.release();
    });
}

const getSkill = (connection, res, type, skills, skill, rank, name) => {
    let query = q.hiscoresSkillQuery(skill, rank, name);
    connection.query(query, (err, rows) => {
        if (err) return console.error(err);
        hiscores = [];
        let i = 1;
        if (rank !== undefined && rank > 6) {
            i = rank - 6;
        }
        rows.forEach(element => {
            thisHiscore = {
                rank: i,
                username: element.username,
                skill: element['cur_' + skill],
                experience: Math.floor(element['exp_' + skill] / 4)
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
        connection.release();
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
    exports.getConnection(type, (err, connection) => {
        if (err) return console.error(err);
        if (skill === undefined || skill === '' || skill === 'overall') {
            getOverall(connection, res, type, skills, rank, name);
        }
        else {
            getSkill(connection, res, type, skills, skill, rank, name);
        }
    });
}

exports.getOnlineAll = (res, callback) => {
    exports.getConnection(constant.OPENRSC, (err, connection) => {
        if (err) return console.error(err);
        let query = 'SELECT COUNT(*) FROM openrsc_players WHERE online=1';
        connection.query(query, (err, rows) => {
            if (err) return console.error(err);
            let online = 0;
            let openrscOnline = rows[0]['COUNT(*)'];
            if (Number.isInteger(openrscOnline)) {
                online += openrscOnline;
            }
            exports.getConnection(constant.CABBAGE, (err, connection2) => {
                if (err) return console.error(err);
                connection2.query(query, (err, rows) => {
                    if (err) return console.error(err);
                    let cabbageOnline = rows[0]['COUNT(*)'];
                    if (Number.isInteger(cabbageOnline)) {
                        online += cabbageOnline;
                    }
                    callback(online);
                    connection2.release();
                });
            });
            connection.release();
        });
    });
}

exports.getOnlineSpecific = (res, callback) => {
    exports.getConnection(constant.OPENRSC, (err, connection) => {
        if (err) return console.error(err);
        let query = 'SELECT COUNT(*) FROM openrsc_players WHERE online=1';
        connection.query(query, (err, rows) => {
            if (err) return console.error(err);
            let openrscOnline = rows[0]['COUNT(*)'];
            if (isNaN(openrscOnline)) {
                openrscOnline = 0;
            }
            exports.getConnection(constant.CABBAGE, (err, connection2) => {
                if (err) return console.error(err);
                connection2.query(query, (err, rows) => {
                    if (err) return console.error(err);
                    let cabbageOnline = rows[0]['COUNT(*)'];
                    if (isNaN(cabbageOnline)) {
                        cabbageOnline = 0;
                    }
                    callback(openrscOnline, cabbageOnline);
                    connection2.release();
                });
            });
            connection.release();
        });
    });
}

exports.pool = pool;
