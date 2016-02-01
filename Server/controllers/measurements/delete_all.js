require('../../models/measurement');

var mongoose = require('mongoose');
var async = require('async');
var Measurement = mongoose.model('Measurement');


// DELETE ALL
exports.request = function(req, res){
	Measurement.remove({ track_id: track._id }, function(err) {
		res.jsonp(null);
	});
};
