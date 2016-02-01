require('../../models/sensebox');

var mongoose = require('mongoose');
var async = require('async');
var Sensebox = mongoose.model('Sensebox');
var Measurement = mongoose.model('Measurement');
var Track = mongoose.model('Track');


// DELETE
exports.request = function(req, res){

	async.waterfall([
    	function(callback) {
			// GET ALL RELATRED TRACKS
			Track.find({box_id: req.params.boxId}).exec(function(err, tracks) {
				callback(null, tracks);
			});
    	},
	    function(tracks, callback) {
			console.log(tracks);
			// DELETE ALL MEASUREMENTS
			async.forEachOf(tracks, function (track, key, callback) {
				Measurement.remove({ track_id: track._id }, function(err) {
					callback(null);
				});
			}, function (err) {
				callback(null);
			});
	    },
	    function(callback) {
			// DELETE TRACKS
			Track.remove({ box_id: req.params.boxId }, function(err) {
				callback(null);
			});
	    },
		function(callback) {
			// DELETE SENSEBOX
			Sensebox.load(req.params.boxId, function(err, sensebox){
				sensebox.remove(function(err) {
					callback(null);
		    	});
			});
		}
	], function (err, result) {
	    res.jsonp(null);
	});
};
