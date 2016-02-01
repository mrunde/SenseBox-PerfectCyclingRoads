require('../../models/track');

var mongoose = require('mongoose');
var async = require('async');
var Measurement = mongoose.model('Measurement');
var Track = mongoose.model('Track');


// DELETE ALL
exports.request = function(req, res){
	async.waterfall([
		function(callback) {
			// GET ALL RELATED TRACKS
			Track.find({box_id: req.params.boxId}).exec(function(err, tracks) {
				callback(null, tracks);
			});
		},
		function(tracks, callback) {
			// DELETE ALL RELATED MEASUREMENTS
			async.forEachOf(tracks, function (track, key, callback) {
				Measurement.remove({ track_id: track._id }, function(err) {
					callback(null);
				});
			}, function (err) {
			    callback(null);
			});
		},
		function(callback) {
			// DELETE ALL TRACKS
			Track.remove({ box_id: req.params.boxId }, function(err) {
				callback(null);
			});
		}
	], function (err, result) {
		res.jsonp(null);
	});
};
