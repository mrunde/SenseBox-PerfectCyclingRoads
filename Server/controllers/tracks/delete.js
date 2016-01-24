require('../../models/track');

var mongoose = require('mongoose');
var Track = mongoose.model('Track');


// DELETE
exports.request = function(req, res){
	Track.load(req.params.trackId, function(err, track){
		track.remove(function(err) {
		    res.jsonp(track);
    	});
	});
};
