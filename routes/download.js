const express = require('express');
const router = express.Router();
const db = require("../db");

router.get('/', async (req, res, next) => {
    const online = await db.getOnline();
    res.render('download', {
        page_name: "Download | Open RuneScape Classic",
        description: "Download our open source client on Android or desktop!",
        openrsc: online.openrsc !== undefined ? online.openrsc : 0,
        cabbage: online.cabbage !== undefined ? online.cabbage : 0
    });
});

module.exports = router;
