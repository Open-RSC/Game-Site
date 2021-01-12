try {
    notes = require('../data/Bestiary.json');
} catch (err) {
    console.error("Could not parse Bestiary.json file - please correct!");
}

//const notes = require('../data/Bestiary.json');

const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('bestiary', {
        page_name: "Open RuneScape Classic | Bestiary",
        description: "Descriptions and GIFs of various creatures in RuneScape Classic",
        notes: notes ? notes.notes : []
    });
});

module.exports = router;