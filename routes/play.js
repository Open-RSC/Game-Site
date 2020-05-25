const express = require('express');
const router = express.Router();
const db = require("../db");

router.get('/', function(req, res, next) {
  db.getOnlineSpecific(res, (openrsc, cabbage) => {
    res.render('play', {
      openrsc: openrsc,
      cabbage: cabbage
    });
  });
});

module.exports = router;
