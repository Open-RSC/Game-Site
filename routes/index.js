const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', function(req, res, next) {
    db.getOnlineAll(res, (online) => {
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
});

module.exports = router;
