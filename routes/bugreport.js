const createError = require('http-errors');
const nodemailer = require('nodemailer');
const express = require('express');
const router = express.Router();
const { verify } = require('hcaptcha');
const rateLimit = require("express-rate-limit");
const { mailhost, mailport, mailuser, mailpass, servicedesk, sitekey, secret } = require('../constant');

const pageProps = {
  sitekey: sitekey,
  page_name: "Open RuneScape Classic | Quick Bug Report Form",
  description: "Submit an issue or bug explored with the game.",
};

const formPostLimiter = rateLimit({
  windowMs: 30 * 1000, // 30 second window
  max: 1, // start blocking after 1 requests,
  handler: (req, res, next) => res.status(429).render('error', {
    message: "We're sorry but you have sent many requests recently. Please try again later."
  })
});

router.get('/', (req, res, next) => {
  res.render('bug_report', {
    ...pageProps,
    csrfToken: req.csrfToken(),
  });
});

// POST route from bug form
router.post('/', formPostLimiter, async (req, res, next) => {

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
      ...pageProps,
      csrfToken: req.csrfToken(),
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
            ...pageProps,
            csrfToken: req.csrfToken(),
            message: message
          });
        });
      })
      .catch();
  }

})

module.exports = router;
