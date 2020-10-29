const nodemailer = require('nodemailer');
const express = require('express');
const router = express.Router();
const { verify } = require('hcaptcha');
const { mailhost, mailport, mailuser, mailpass, servicedesk, sitekey, secret } = require('../constant');

router.get('/', (req, res, next) => {
  res.render('bug_report', {
    csrfToken: req.csrfToken(),
    sitekey: sitekey,
    page_name: "Open RuneScape Classic | Quick Bug Report Form",
    description: "Submit an issue or bug explored with the game."
  });
});

// POST route from contact form
router.post('/', async (req, res, next) => {

  const token = req.body['g-recaptcha-response'] ? `${req.body['g-recaptcha-response']}`
    : (req.body['h-captcha-response'] ? `${req.body['h-captcha-response']}` : 'token');

  // Instantiate the SMTP server
  const smtpTrans = nodemailer.createTransport({
    host: mailhost,
    port: mailport,
    secure: true,
    auth: {
      user: mailuser,
      pass: mailpass
    }
  })

  // Specify what the email will look like
  const mailOpts = {
    from: mailuser, // This is ignored by Gmail
    to: servicedesk,
    subject: `${req.body.title}`,
    text: `User: ${req.body.user} <br/>\r\n Issue: ${req.body.description}`
  }

  const missingFields = !req.body.title || req.body.title.trim() === ''
    || !req.body.description || req.body.description.trim() === '';

  if (missingFields) {
    res.render('bug_report', {
      csrfToken: req.csrfToken(),
      sitekey: sitekey,
      page_name: "Open RuneScape Classic | Quick Bug Report Form",
      description: "Submit an issue or bug explored with the game.",
      message: 'Please fill out the title and description for the issue'
    });
  } else {
    verify(secret, token)
      .then((data) => {
        // Attempt to send the email
        smtpTrans.sendMail(mailOpts, (error, response) => {
          let message;
          if (error) {
            message = 'An issue occured when submitting bug, please try again';
          }
          else {
            message = 'Bug successfully sent!';
          }
          res.render('bug_report', {
            csrfToken: req.csrfToken(),
            sitekey: sitekey,
            page_name: "Open RuneScape Classic | Quick Bug Report Form",
            description: "Submit an issue or bug explored with the game.",
            message: message
          });
        });
      })
      .catch();
  }

})

module.exports = router;
