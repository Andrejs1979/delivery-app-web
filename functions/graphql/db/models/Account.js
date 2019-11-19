const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const { Schema } = mongoose;

const userSchema = new Schema(
	{
		uid: String,
		email: String,
		firstName: String,
		lastName: String,
		avatar: String,
		phone: String,
		status: { type: String, default: 'active' },
		role: { type: String, default: 'default' }
	},
	{ timestamps }
);

const cardSchema = new Schema(
	{
		provider: { type: String, default: 'stripe' },
		providerID: String,
		token: String,
		providerName: String,
		billingAddress: String,
		billingCity: String,
		billingState: String,
		billingZip: String,
		billingCountry: String,
		brand: String,
		last4: String,
		expMM: Number,
		expYYYY: Number,
		type: String,
		method: String,
		country: String
	},
	{ timestamps }
);

const transactionSchema = new Schema(
	{
		type: String,
		_consumer: {
			type: Schema.Types.ObjectId,
			ref: 'consumers'
		},
		_consumerTran: {
			type: Schema.Types.ObjectId,
			ref: 'consumers.transactions'
		},
		_location: { type: Schema.Types.ObjectId, ref: 'locations' },
		_campaign: { type: Schema.Types.ObjectId, ref: 'campaigns' },
		_ad: { type: Schema.Types.ObjectId, ref: 'campaigns.ads' },
		_post: { type: Schema.Types.ObjectId, ref: 'consumers.posts' },
		amount: String,
		currency: String,
		status: String
	},
	{
		timestamps
	}
);

const accountSchema = new Schema(
	{
		name: String,
		type: String,
		category: String,
		apiKey: String,
		status: {
			type: String,
			default: 'new'
		},
		users: [ userSchema ],
		cards: [ cardSchema ],
		isLive: {
			type: Boolean,
			default: false
		},
		balance: {
			type: Number,
			default: 0
		},
		transactions: [ transactionSchema ]
	},
	{
		timestamps
	}
);

module.exports = mongoose.model('accounts', accountSchema);
