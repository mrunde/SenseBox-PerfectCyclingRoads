require('../../models/track');

var mongoose = require('mongoose');
var async = require('async');
var Measurement = mongoose.model('Measurement');
var Track = mongoose.model('Track');


// DELETE
exports.request = function(req, res){
	async.waterfall([
		function(callback) {
			// DELETE ALL RELATED MEASUREMENTS
			Measurement.remove({ track_id: req.params.trackId }, function(err) {
				callback(null);
			});
		},
		function(callback) {
			// DELETE TRACK
			Track.load(req.params.trackId, function(err, track){
				track.remove(function(err) {
				    callback(null);
		    	});
			});
		}
	], function (err, result) {
		res.jsonp(null);
	});
};
