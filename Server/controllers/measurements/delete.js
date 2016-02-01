require('../../models/measurement');

var mongoose = require('mongoose');
var Measurement = mongoose.model('Measurement');


// DELETE
exports.request = function(req, res){
	Measurement.load(req.params.measurementId, function(err, measurement){
		res.jsonp(measurement);
	});
};
