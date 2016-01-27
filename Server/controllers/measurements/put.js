require('../../models/measurement');

var _ = require('underscore');
var mongoose = require('mongoose');
var Measurement = mongoose.model('Measurement');


// PUT
exports.request = function(req, res){
	Measurement.load(req.params.measurementId, function(err, measurement){
		measurement = _.extend(measurement, req.body);
		measurement.set("updated", Date.now());
		measurement.save(function(err) {
			if (err) {
	        	res.send(err);
		    } else {
		        res.jsonp(measurement);
	        }
    	});
	});
};
