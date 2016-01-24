require('../../models/measurement');

var mongoose = require('mongoose');
var Measurement = mongoose.model('Measurement');


// LIST
exports.request = function(req, res){
	Measurement.find({track_id: req.params.trackId}).exec(function(err, measurements) {
		res.jsonp(measurements);
	});
};
