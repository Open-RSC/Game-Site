const createError = require('http-errors');
const nodemailer = require('nodemailer');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const csrf = require('csurf');

const {protocol, website} = require('./constant')

const indexRouter = require('./routes/index');
const playRouter = require('./routes/play');
const downloadRouter = require('./routes/download');
const openrscRouter = require('./routes/openrsc');
const cabbageRouter = require('./routes/cabbage');
const faqRouter = require('./routes/faq');
const patchnotesRouter = require('./routes/patchnotes');
const codeRouter = require('./routes/code');
const bugRouter = require('./routes/bugreport');

const app = express();
app.use(helmet());
app.use(compression());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use((req, res, next) => {
    res.locals.url = protocol + "://" + website;
    next();
})

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser());
app.use(csrf({cookie: true}));
app.use('/static', express.static(
    path.join(__dirname, 'public'),
    {maxAge: 86400000}
));
app.use('/downloads', express.static(
    path.join(__dirname, 'public/downloads'),
    {maxAge: 86400000}
));


app.use('/', indexRouter);
app.use('/play', playRouter);
app.use('/download', downloadRouter);
app.use('/openrsc', openrscRouter);
app.use('/cabbage', cabbageRouter);
app.use('/faq', faqRouter);
app.use('/patchnotes', patchnotesRouter);
app.use('/code', codeRouter);
app.use('/bug-report', bugRouter);

app.get("/sitemap.xml", function (req, res, next) {
    res.sendFile(__dirname + '/public/sitemap.xml');
});

app.get("/robots.txt", function (req, res, next) {
    res.sendFile(__dirname + '/public/robots.txt');
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    //console.error(err);
    res.status(err.status || 500).render('error', {
        message: "This page doesn't seem to exist... If you think it should, let us know on Discord!"
    });
});

module.exports = app;
