require('../../models/measurement');

var mongoose = require('mongoose');
var Measurement = mongoose.model('Measurement');


// POST
exports.request = function(req, res){
	var measurement = new Measurement(req.body);
	measurement.save(function(err) {
		if (err) {
	       	res.send(err);
	    } else {
	        res.jsonp(measurement);
	    }
    });
};
