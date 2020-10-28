const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('code', {
    page_name: "Open RuneScape Classic | Source Code & Bug Reports",
    description: "Explore the code made that freely makes available RuneScape Classic or submit an issue."
  });
});

module.exports = router;
