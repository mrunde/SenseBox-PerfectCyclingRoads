require('../../models/sensebox');

var mongoose = require('mongoose');
var Sensebox = mongoose.model('Sensebox');


// POST
exports.request = function(req, res){
	var sensebox = new Sensebox(req.body);
	sensebox.save(function(err) {
		if (err) {
	       	res.send(err);
	    } else {
	        res.jsonp(sensebox);
	    }
    });
};
