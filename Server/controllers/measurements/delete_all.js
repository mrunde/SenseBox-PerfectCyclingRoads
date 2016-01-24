require('../../models/measurement');

var mongoose = require('mongoose');
var async = require('async');
var Measurement = mongoose.model('Measurement');


// DELETE
exports.request = function(req, res){
	Measurement.find({track_id: req.params.trackId}).exec(function(err, measurements) {
		async.forEachOf(measurements, function (measurement, key, callback) {
			Measurement.load(measurement.measurementId, function(err, _measurement){
				_measurement.remove(function(err) {
				    callback();
		    	});
			});
		}, function (err) {
		    if (err) console.error(err.message);
		    res.jsonp(null);
		});
	});
};
