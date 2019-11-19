const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');

const { Schema } = mongoose;

const postSchema = new Schema(
	{
		_location: { type: Schema.Types.ObjectId, ref: 'locations' },
		_campaign: { type: Schema.Types.ObjectId, ref: 'campaigns' },
		_ad: { type: Schema.Types.ObjectId, ref: 'campaigns.ads' },
		uri: String,
		rate: String,
		currency: { type: String, default: 'USD' },
		status: { type: String, default: 'pending' },
		statusText: String,
		sharedOn: [ String ]
	},
	{ timestamps }
);

const transactionSchema = new Schema(
	{
		type: String,
		_location: { type: Schema.Types.ObjectId, ref: 'locations' },
		_campaign: { type: Schema.Types.ObjectId, ref: 'campaigns' },
		_ad: { type: Schema.Types.ObjectId, ref: 'campaigns.ads' },
		_post: { type: Schema.Types.ObjectId, ref: 'consumers.posts' },
		amount: String,
		currency: String,
		status: String
	},
	{ timestamps }
);

const consumerSchema = new Schema(
	{
		firebaseUID: String,
		provider: { type: String, default: 'local' },
		providerUID: String,
		email: String,
		password: String,
		displayName: String,
		firstName: String,
		lastName: String,
		avatar: String,
		balance: { type: String, default: '0' },
		affiliateKey: String,
		referredBy: String,
		posts: [ postSchema ],
		campaigns: [ { type: Schema.Types.ObjectId, ref: 'campaigns' } ],
		transactions: [ transactionSchema ]
	},
	{ timestamps: true }
);

module.exports = mongoose.model('consumers', consumerSchema);
