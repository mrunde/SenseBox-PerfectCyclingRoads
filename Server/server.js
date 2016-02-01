var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var async = require('async');
var debug = require('debug');

// ROUTES
var measurements = require('./routes/measurements');
var tracks = require('./routes/tracks');
var boxes = require('./routes/boxes');


// WEBSERVER
var app = express();
app.set('port', process.env.PORT || 8080);

var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
  console.log('Express server listening on port ' + server.address().port);
});


// WEB-CLIENT
app.use(express.static(path.join(__dirname, '/public')));


// DATABASE CONNECTION
mongoose.connect('mongodb://127.0.0.1/osm_mobile');
var db = mongoose.connection;

db.on('error', function callback(){
    console.log("Connection to MongoDB failed!");
});

db.once('open', function callback(){
    console.log("Connection to MongoDB successfull!");
});


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());


// REST-API
app.use('/api', boxes);
app.use('/api', tracks);
app.use('/api', measurements);


/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send(JSON.stringify({
        message: err.message,
        error: {}
    }));
});


module.exports = app;
