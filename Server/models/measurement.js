var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var MeasurementSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	updated: {
		type: Date,
		default: Date.now
	},
	track_id: {
		type: Schema.Types.ObjectId,
		ref: 'Track',
		required: true
	},
	timestamp: {
		type: String,
		required: true
	},
	lng: {
		type: Number,
		required: true
	},
	lat: {
		type: Number,
		required: true
	},
	altitude: {
		type: Number,
		required: true
	},
	speed: {
		type: Number,
		required: true
	},
	vibration: {
		type: Number,
		required: true
	},
	sound: {
		type: Number,
		required: true
	},
	brightness: {
		type: Number,
		required: true
	},
	uv: {
		type: Number,
		required: true
	},
	ir: {
		type: Number,
		required: true
	}
});


MeasurementSchema.statics = {
	load: function(id, cb){
		this.findOne({_id : id}).exec(cb);
	}
};

mongoose.model('Measurement', MeasurementSchema);
