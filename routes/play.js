const express = require('express');
const router = express.Router();
const db = require("../db");

router.get('/', async (req, res, next) => {
    const online = await db.getOnline();
    res.render('play', {
        page_name: "Open RuneScape Classic: Striving for a replica RSC game and more",
        openrsc: online.openrsc !== undefined ? online.openrsc : 0,
        cabbage: online.cabbage !== undefined ? online.cabbage : 0
    });
});

module.exports = router;
