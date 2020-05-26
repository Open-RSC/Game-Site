const express = require('express');
const router = express.Router();

/* GET rules page. */
router.get('/', (req, res, next) => {
  res.render('rules', {
    page_name: "Open RuneScape Classic | Rules"
  });
});

module.exports = router;
