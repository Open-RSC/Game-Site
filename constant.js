const {DataTypes} = require('sequelize');

exports.host = 'mariadb'; // Change to localhost if not using Docker for database server
exports.port = 3306;
exports.username = 'root';
exports.password = 'root';
exports.architecture = 'mysql';
exports.OPENRSC = 'openrsc';
exports.CABBAGE = 'cabbage';

exports.protocol = 'https';
exports.website = 'runescapeclassic.dev';

exports.itemnames = require('./data/itemnames.json')['items'];
exports.itemdefs = require('./data/ItemDefs.json')['item'];
exports.itemdefscustom = require('./data/ItemDefsCustom.json')['items'];

exports.mailhost = 'mailprovider';
exports.mailport = 587;
exports.mailuser = 'mailuser';
exports.mailpass = 'mailpass';
exports.servicedesk = 'service.desk@email';

exports.sitekey = 'sitekey';
exports.secret = 'secret';

exports.GROUP = {
    OWNER: 0,
    ADMIN: 1,
    SUPER_MOD: 2,
    MOD: 3,
    DEV: 5,
    EVENT: 7,
    PLAYER_MOD: 8,
    TESTER: 9,
    USER: 10
}

exports.possibleSkills = [
    'overall', 'attack', 'defense',
    'strength', 'hits', 'ranged',
    'prayer', 'magic', 'cooking',
    'woodcut', 'fletching', 'fishing',
    'firemaking', 'crafting', 'smithing',
    'mining', 'herblaw', 'agility', 'thieving'
];

exports.playerDetails = {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    skill_total: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    group_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    banned: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    iron_man: {
        type: DataTypes.TINYINT,
        allowNull: false
    },
    quest_points: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    combat: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    kills: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    npc_kills: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    deaths: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    online: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    login_date: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
};

exports.playerCacheDetails = {
    playerID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    key: {
        type: DataTypes.STRING,
        allowNull: false
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false
    }
};

exports.inventoryItemDetails = {
    itemID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    playerID: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
};

exports.bankItemDetails = {
    itemID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    playerID: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
};

exports.equipmentDetails = {
    itemID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    playerID: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
};

exports.itemStatusesDetails = {
    itemID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    catalogID: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
};

exports.clanDetails = {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tag: {
        type: DataTypes.STRING,
        allowNull: false
    },
    leader: {
        type: DataTypes.STRING,
        allowNull: false
    }
};

exports.clanPlayersDetails = {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    clan_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    rank: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
};

exports.liveFeedsDetails = {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false
    },
    time: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
};

exports.getExperience = (type) => {
    let experience = {
        playerID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        }
    };

    // Add authentic skills.
    exports.possibleSkills.slice(1).forEach((element) => {
        experience[element] = {
            type: DataTypes.INTEGER,
            allowNull: false
        };
    });

    // Add Runecraft and Harvesting for custom loads.
    if (type === exports.CABBAGE) {
        experience.runecraft = {
            type: DataTypes.INTEGER,
            allowNull: false
        }
        experience.harvesting = {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }
    return experience;
}

// skills to display for hiscores
exports.getDisplaySkills = (type) => {
    let listOfSkills;
    if (type === exports.CABBAGE) {
        listOfSkills = exports.possibleSkills.slice(1)
            .concat(['runecraft', 'harvesting']);
    } else {
        // attack, strength and defense originally not shown
        listOfSkills = exports.possibleSkills.slice(4);
    }
    return listOfSkills;
}

// all available skills
exports.getSkills = (type) => {
    let listOfSkills;
    if (type === exports.CABBAGE) {
        listOfSkills = exports.possibleSkills.slice(1)
            .concat(['runecraft', 'harvesting']);
    } else {
        listOfSkills = exports.possibleSkills.slice(1);
    }
    return listOfSkills;
}

exports.totalExperienceString = (type) => {
    let str = '';
    let listOfSkills = exports.getSkills(type).slice();
    listOfSkills.forEach((element) => {
        str += element + "+";
    });
    return str.slice(0, str.length - 1); // We don't want a trailing +
}

exports.experienceToLevel = (exp) => {
    let experienceArray = [0, 83, 174, 276, 388, 512, 650, 801, 969, 1154, 1358, 1584, 1833, 2107, 2411, 2746, 3115, 3523, 3973, 4470, 5018, 5624, 6291, 7028, 7842, 8740, 9730, 10824, 12031, 13363, 14833, 16456, 18247, 20224, 22406, 24815, 27473, 30408, 33648, 37224, 41171, 45529, 50339, 55649, 61512, 67983, 75127, 83014, 91721, 101333, 111945, 123660, 136594, 150872, 166636, 184040, 203254, 224466, 247886, 273742, 302288, 333804, 368599, 407015, 449428, 496254, 547953, 605032, 668051, 737627, 814445, 899257, 992895, 1096278, 1210421, 1336443, 1475581, 1629200, 1798808, 1986068, 2192818, 2421087, 2673114, 2951373, 3258594, 3597792, 3972294, 4385776, 4842295, 5346332, 5902831, 6517253, 7195629, 7944614, 8771558, 9684577, 10692629, 11805606, 13034431, 14391160, 15889109, 17542976, 19368992, 21385073, 23611006, 26068632, 28782069, 31777943, 35085654, 38737661, 42769801, 47221641, 52136869, 57563718, 63555443, 70170840, 77474828, 85539082, 94442737, 104273167];
    for (let level = 0; level < 98; level++) {
        if (exp / 4 >= experienceArray[level + 1]) {
            continue;
        }
        return (level + 1);
    }
    return 99;
}
