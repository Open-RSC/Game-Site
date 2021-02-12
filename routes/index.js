let notes;
try {
    notes = require('../data/PatchNotes.json');
} catch (err) {
    console.error("Could not parse PatchNotes.json file - please correct!");
}

//const notes = require('../data/PatchNotes.json');

const express = require('express');
const router = express.Router();
const db = require('../db')

router.get('/', async (req, res, next) => {
    const servers = await db.getOnline();
    const feed = await db.getLiveFeeds();

    // Preservation
    let preservationonline = 0;
    if (!isNaN(servers.openrsc)) {
        preservationonline = servers.openrsc;
    }

    // Cabbage
    let cabbageonline = 0;
    if (!isNaN(servers.cabbage)) {
        cabbageonline = servers.cabbage;
    }

    // Uranium
    let uraniumonline = 0;
    if (!isNaN(servers.uranium)) {
        uraniumonline = servers.uranium;
    }

    // Coleslaw
    let coleslawonline = 0;
    if (!isNaN(servers.coleslaw)) {
        coleslawonline = servers.coleslaw;
    }

    let preservationonlineString = "";
    if (preservationonline !== 0) {
        if (preservationonline === 1) {
            preservationonlineString = preservationonline + " player";
        }
        if (preservationonline === 2000) {
            preservationonlineString = "FULL";
        } else {
            preservationonlineString = preservationonline + " players";
        }
    } else {
        preservationonlineString = "0 players";
    }

    let cabbageonlineString = "";
    if (cabbageonline !== 0) {
        if (cabbageonline === 1) {
            cabbageonlineString = cabbageonline + " player";
        }
        if (cabbageonline === 2000) {
            cabbageonlineString = "FULL";
        } else {
            cabbageonlineString = cabbageonline + " players";
        }
    } else {
        cabbageonlineString = "0 players";
    }

    if (uraniumonline !== 0) {
        if (uraniumonline === 1) {
            uraniumonlineString = uraniumonline + " cyborg";
        }
        if (uraniumonline === 2000) {
            uraniumonlineString = "FULL";
        } else {
            uraniumonlineString = uraniumonline + " cyborgs";
        }
    } else {
        uraniumonlineString = "0 cyborgs";
    }

    if (coleslawonline !== 0) {
        if (coleslawonline === 1) {
            coleslawonlineString = coleslawonline + " cyborg";
        }
        if (coleslawonline === 2000) {
            coleslawonlineString = "FULL";
        } else {
            coleslawonlineString = coleslawonline + " cyborgs";
        }
    } else {
        coleslawonlineString = "0 cyborgs";
    }

    res.render('index', {
        page_name: "Open RuneScape Classic - Play the replica today",
        preservationonline: preservationonlineString,
        cabbageonline: cabbageonlineString,
        uraniumonline: uraniumonlineString,
        coleslawonline: coleslawonlineString,
        notes: notes ? notes.notes : [],
        live_feed: feed
    });
});

module.exports = router;
