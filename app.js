var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
const mongoose = require('mongoose'); // Node Tool for MongoDB
const config = require('./config/config'); // Mongoose Config
const flash = require('express-flash')
const session = require('express-session')

/** Configured Passport */
const passport = require('./config/passport');

var authRouter = require('./routes/auth.route')
var imageRouter = require('./routes/image.route')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Passport init
app.use(flash())
app.use(session({
  secret: config.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

// connect MongoDB
mongoose.Promise = global.Promise;
mongoose.connect(config.URI_MONGO, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
}, (err) => {
  // Check if database was able to connect
  if (err) {
    console.log('Could NOT connect to database: ', err); // Return error message
  } else {
    console.log('Connected to MONGO' ); // Return success message
  }
});


app.use('/api/v1/users', authRouter);
app.use('/api/v1/images', imageRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404, 'test'));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
