var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var TrackSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	updated: {
		type: Date,
		default: Date.now
	},
	box_id: {
		type: Schema.Types.ObjectId,
		ref: 'Sensebox',
		required: true
	}
});


TrackSchema.statics = {
	load: function(id, cb){
		this.findOne({_id : id}).exec(cb);
	}
};

mongoose.model('Track', TrackSchema);
