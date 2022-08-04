var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var rateLimit = require('express-rate-limit');
var dotenv = require('dotenv');
var cors = require('cors');

var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');

dotenv.config();

var app = express();

corsConfig = {
  origin: ['http://localhost:3000', "https://habacteam.web.app"],
  credentials: true,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsConfig));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 minutes
  max: 2,
  handler: function (req, res) {
      res.status(429).send({
          status: 500,
          message: 'Too many requests!',
      });
  },
  skip: (req, res) => {
      if(req.ip === '::ffff:127.0.0.1')
          return true;
      return false;
  }
});

app.use('/', indexRouter);
app.use('/api', apiLimiter, apiRouter);

module.exports = app;
