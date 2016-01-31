require('../../models/track');

var mongoose = require('mongoose');
var Track = mongoose.model('Track');


// POST
exports.request = function(req, res){
	var track = new Track(req.body);
	track.save(function(err) {
		if (err) {
	       	res.send(err);
	    } else {
	        res.jsonp(track);
	    }
    });
};
