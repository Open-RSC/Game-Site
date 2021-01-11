const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('news', {
        page_name: "Open RuneScape Classic | News",
        description: "Find out the latest news about Open RuneScape Classic."
    });
});

module.exports = router;
