const express = require('express');
const router = express.Router();
const db = require("../db");

router.get('/', function(req, res, next) {
    const online = db.getOnline(res);
    res.render('play', {
        openrsc: online.openrsc !== undefined ? online.openrsc : 0,
        cabbage: online.cabbage !== undefined ? online.cabbage : 0
    });
});

module.exports = router;
