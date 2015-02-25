var express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    fs = require('fs'),
    morgan = require('morgan'),
    methodOverride = require('method-override'),
    app = express(),
    mongoose = require('mongoose'),
    passport = require('passport'),
    session = require('express-session'),
    multer = require('multer'),
    csrf = require('csurf'),
    cookieParser = require('cookie-parser'),
    config = require('./config/config.js');

mongoose.connect(config.db);

var modelsPath = path.join(__dirname, 'models');
fs.readdirSync(modelsPath).forEach(function (file) {
    require(modelsPath + '/' + file);
});

require('./config/passport');

app.set('views', __dirname + '/public/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(multer({dest: './public/images'}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(session({
    secret: 'Itsatrap'
}));

app.use(csrf());
app.use(function(req, res, next) {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    next();
});

app.use(passport.initialize());
app.use(passport.session());

require('./config/routes')(app);

var port = process.env.PORT || 3000;
app.listen(8080, function () {
    console.log('Server listening on port %d', port);
});

