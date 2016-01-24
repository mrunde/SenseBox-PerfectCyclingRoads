require('../../models/track');

var mongoose = require('mongoose');
var Track = mongoose.model('Track');


// PUT
exports.request = function(req, res){
	Track.load(req.params.trackId, function(err, track){
		track = _.extend(track, req.body);
		track.set("updated", Date.now());
		track.save(function(err) {
			if (err) {
	        	res.send(err);
		    } else {
		        res.jsonp(track);
	        }
    	});
	});
};
