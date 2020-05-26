const express = require('express');
const router = express.Router();
const db = require('../db')

router.get('/', (req, res, next) => {
    const servers = db.getOnline();
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
      page_name: "Open RuneScape Classic: Striving for a replica RSC game and more",
      online: onlineString
    });
});

module.exports = router;
