const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const compression = require('compression')
const helmet = require('helmet');
const csrf = require('csurf')

const db = require('./db');

const indexRouter = require('./routes/index');
const playRouter = require('./routes/play');
const openrscRouter = require('./routes/openrsc');
const cabbageRouter = require('./routes/cabbage');
const rulesRouter = require('./routes/rules');
const faqRouter = require('./routes/faq');

const app = express();
app.use(helmet());
app.use(compression());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser());
app.use(csrf({ cookie: true }));
app.use(express.static(
  path.join(__dirname, 'public'),
  {maxAge: 86400000}
));

app.use('/', indexRouter);
app.use('/play', playRouter);
app.use('/openrsc', openrscRouter);
app.use('/cabbage', cabbageRouter);
app.use('/rules', rulesRouter);
app.use('/faq', faqRouter);

// Cache
app.use((req, res, next) => {
  res.set({
    "Cache-Control": "public, max-age=86400",
    "Expires": new Date(Date.now() + 86400000).toUTCString()
  })
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
  console.log(err);
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
