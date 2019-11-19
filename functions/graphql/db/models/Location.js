const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const { Schema } = mongoose;

mongoose.ObjectId.get((v) => {
	if (v) return v.toString();
});

const geoSchema = new Schema({
	coordinates: {
		type: [ Number ],
		index: '2dsphere'
	},
	bounds: {
		south: Number,
		west: Number,
		north: Number,
		east: Number
	},
	viewport: {
		south: Number,
		west: Number,
		north: Number,
		east: Number
	},
	type: {
		type: String,
		default: 'Point'
	}
});

const assetsSchema = new Schema(
	{
		logoURI: { type: String, default: 'campaign_logo_placeholder.png' },
		defaultPictureURI: { type: String, default: 'campaign_default_picture_placeholder.png' }
	},
	{
		timestamps
	}
);

const locationSchema = new Schema(
	{
		name: String,
		category: String,
		types: [ String ],
		fullAddress: String,
		address: String,
		city: String,
		state: String,
		zip: String,
		country: String,
		campaigns: [
			{
				type: Schema.Types.ObjectId,
				ref: 'campaigns'
			}
		],
		geometry: geoSchema,
		assets: assetsSchema,
		source: String,
		sourceID: String,
		posts: Number,
		verified: {
			type: Boolean,
			default: false
		},
		active: {
			type: Boolean,
			default: true
		}
	},
	{
		timestamps
	}
);

module.exports = mongoose.model('locations', locationSchema);
