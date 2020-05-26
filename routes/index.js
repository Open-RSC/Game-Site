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
    if (online === 1) {
      onlineString = "is currently " + online + " person";
    }
    else {
      onlineString = "are currently " + online + " people";
    }
    res.render('index', {
      online: onlineString
    });
});

module.exports = router;
