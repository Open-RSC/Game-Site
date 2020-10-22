const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('faq', {
        page_name: "Open RuneScape Classic | Rules & Frequently Asked Questions",
        description: "Rules and frequently asked questions about the open source project Open RuneScape Classic."
    });
});

module.exports = router;
