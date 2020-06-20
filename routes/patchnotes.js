const notes = require('../data/PatchNotes.json');

const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('patchnotes', {
    page_name: "Open RuneScape Classic | Patch Notes",
    description: "The most recent patch notes on the Open RuneScape Classic source!",
    notes: notes.notes
  });
});

module.exports = router;