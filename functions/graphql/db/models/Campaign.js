const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const { Schema } = mongoose;

//mongoose.ObjectId.get((v) => {
//	if (v) return v.toString();
//});

const adSchema = new Schema(
	{
		rate: { type: String, default: '0.50' },
		currency: { type: String, default: 'USD' },
		creativeURI: String,
		size: Number,
		aspectRatio: Number,
		position: { type: String },
		background: Boolean,
		message: String,
		radius: { type: Number, default: 15 },
		status: {
			type: String,
			default: 'active'
		}
	},
	{
		timestamps
	}
);

const transactionSchema = new Schema(
	{
		_consumer: {
			type: Schema.Types.ObjectId,
			ref: 'consumers'
		},
		dateTime: String,
		amount: String,
		currency: { type: String, default: 'USD' }
	},
	{
		timestamps
	}
);

const campaignSchema = new Schema(
	{
		name: String,
		hashtag: String,
		cooldown: Number,
		_account: {
			type: Schema.Types.ObjectId,
			ref: 'accounts'
		},
		category: String,
		status: {
			type: String,
			default: 'new'
		},
		isLive: {
			type: Boolean,
			default: false
		},
		ads: [ adSchema ],
		limit: {
			type: Number,
			default: 10000
		},
		transactions: [ transactionSchema ]
	},
	{
		timestamps
	}
);

module.exports = mongoose.model('campaigns', campaignSchema);
