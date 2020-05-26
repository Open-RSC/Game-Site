const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('faq', {
    page_name: "Open RuneScape Classic | Frequently Asked Questions"
  });
});

module.exports = router;
