require('../../models/sensebox');

var mongoose = require('mongoose');
var Sensebox = mongoose.model('Sensebox');


// GET
exports.request = function(req, res){
	Sensebox.load(req.params.boxId, function(err, sensebox){
		res.jsonp(sensebox);
	});
};
