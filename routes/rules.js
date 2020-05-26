const express = require('express');
const router = express.Router();

/* GET rules page. */
router.get('/', (req, res, next) => {
  res.render('rules', {});
});

module.exports = router;
