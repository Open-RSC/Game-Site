const express = require('express');
const router = express.Router();
const db = require("../db");

router.get('/', async (req, res, next) => {
    res.render('download', {
        page_name: "Download | Open RuneScape Classic",
        description: "Download our open source client on Android or desktop!"
    });
});

module.exports = router;
