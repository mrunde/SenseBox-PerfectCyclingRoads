require('../../models/track');

var mongoose = require('mongoose');
var Track = mongoose.model('Track');


// LIST
exports.request = function(req, res){
	Track.find({box_id: req.params.boxId}).exec(function(err, tracks) {
		res.jsonp(tracks);
	});
};
