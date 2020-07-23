const notes = require('../data/PatchNotes.json');

const express = require('express');
const router = express.Router();
const db = require('../db')

router.get('/', async (req, res, next) => {
    const servers = await db.getOnline();
    const feed = await db.getLiveFeeds();
    let online = 0;
    if (!isNaN(servers.openrsc) && !isNaN(servers.cabbage)) {
        online = servers.openrsc + servers.cabbage;
    }
    else if (!isNaN(servers.openrsc)) {
        online = servers.openrsc;
    }
    else if (!isNaN(servers.cabbage)) {
        online = servers.cabbage;
    }
    let onlineString = "";
    if (online !== 0) {
      if (online === 1) {
        onlineString = "There is currently " + online + " person playing!";
      }
      else {
        onlineString = "There are currently " + online + " people playing!";
      }
    }
    res.render('index', {
      page_name: "Open RuneScape Classic - Play the replica today",
      online: onlineString,
      notes: notes.notes,
      live_feed: feed
    });
});

module.exports = router;
