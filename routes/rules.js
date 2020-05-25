const express = require('express');
const router = express.Router();

/* GET rules page. */
router.get('/', function(req, res, next) {
  res.render('rules', {});
});

module.exports = router;
