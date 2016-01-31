var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var SenseboxSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	updated: {
		type: Date,
		default: Date.now
	},
	name: {
		type: String,
		required: true
	},
	boxType: {
    	type: String,
    	required: true
	}
});


SenseboxSchema.statics = {
	load: function(id, cb){
		this.findOne({_id : id}).exec(cb);
	}
};

mongoose.model('Sensebox', SenseboxSchema);
