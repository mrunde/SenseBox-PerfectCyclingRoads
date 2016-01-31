require('../../models/track');

var mongoose = require('mongoose');
var Track = mongoose.model('Track');


// GET
exports.request = function(req, res){
	Track.load(req.params.trackId, function(err, track){
		res.jsonp(track);
	});
};
