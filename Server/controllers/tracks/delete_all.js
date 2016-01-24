require('../../models/track');

var mongoose = require('mongoose');
var async = require('async');
var Track = mongoose.model('Track');


// DELETE
exports.request = function(req, res){
	Track.find({box_id: req.params.boxId}).exec(function(err, tracks) {
		async.forEachOf(tracks, function (track, key, callback) {
			Track.load(track.trackId, function(err, _track){
				_track.remove(function(err) {
				    callback();
		    	});
			});
		}, function (err) {
		    if (err) console.error(err.message);
		    res.jsonp(null);
		});
	});
};
