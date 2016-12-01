var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');
var session = require('express-session');
var config = require('config');
var cors = require('cors');

var validate = require('./app/validator');
require('./app/passport');

var UsersController = require('./app/controllers/UsersController');
var AuthController = require('./app/controllers/AuthController');

var app = express();
var auth = jwt({
  secret: config.Secret,
  userProperty: 'user'
});

mongoose.Promise = global.Promise;
mongoose.connect(config.DBHost);

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors());
app.use(bodyParser.json());

app.use(session({
  secret: config.Secret
}));

var port = process.env.PORT || config.ServerPort;

// Routes
var router = express.Router();
// auth
router.post('/auth/login', validate('auth:login'), AuthController.login);

// users
router.post('/users', validate('users:create'), UsersController.create);

app.use('/api', router);

// Start server
var server =  app.listen(port);
console.log('Magic happens on port ' + port);
module.exports = server;