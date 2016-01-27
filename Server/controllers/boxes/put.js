require('../../models/sensebox');

var _ = require('underscore');
var mongoose = require('mongoose');
var Sensebox = mongoose.model('Sensebox');


// PUT
exports.request = function(req, res){
	Sensebox.load(req.params.boxId, function(err, sensebox){
		sensebox = _.extend(sensebox, req.body);
		sensebox.set("updated", Date.now());
		sensebox.save(function(err) {
			if (err) {
	        	res.send(err);
		    } else {
		        res.jsonp(sensebox);
	        }
    	});
	});
};
