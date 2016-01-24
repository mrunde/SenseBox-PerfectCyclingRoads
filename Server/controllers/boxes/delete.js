require('../../models/sensebox');

var mongoose = require('mongoose');
var Sensebox = mongoose.model('Sensebox');


// DELETE
exports.request = function(req, res){
	Sensebox.load(req.params.boxId, function(err, sensebox){
		sensebox.remove(function(err) {
		    res.jsonp(sensebox);
    	});
	});
};
