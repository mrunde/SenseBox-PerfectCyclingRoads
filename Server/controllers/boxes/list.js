require('../../models/sensebox');

var mongoose = require('mongoose');
var Sensebox = mongoose.model('Sensebox');


// LIST
exports.request = function(req, res){
	Sensebox.find().exec(function(err, senseboxes) {
		res.jsonp(senseboxes);
	});
};
