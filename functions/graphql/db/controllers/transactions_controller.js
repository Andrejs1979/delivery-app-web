const _ = require('lodash');

const Account = require('../models/Account');
const Consumer = require('../models/Consumer');
const Campaign = require('../models/Campaign');

module.exports = {
	async creditConsumer(postID) {
		const consumer = await Consumer.findOne({ 'posts._id': postID });
		const post = consumer.posts.id(postID);
		const campaign = await Campaign.findOne({ 'ads._id': post._ad });
		const account = await Account.findById(campaign._account);

		const consumerBalance = Number(consumer.balance) + Number(post.rate);
		const accountBalance = Number(account.balance) - Number(post.rate);

		const { transactions } = await Consumer.findByIdAndUpdate(
			consumer,
			{
				$set: { balance: consumerBalance },
				$push: {
					transactions: {
						type: 'payment',
						amount: post.rate,
						currency: post.currency,
						status: 'approved',
						_campaign: campaign._id,
						_ad: post._ad,
						_post: postID
					}
				}
			},
			{
				new: true
			}
		)
			.select('-_id transactions')
			.lean();

		const customerTransactions = _.orderBy(transactions, [ 'createdAt' ], [ 'desc' ]);

		await Account.findByIdAndUpdate(
			account,
			{
				$set: { balance: accountBalance },
				$push: {
					transactions: {
						type: 'payment',
						amount: -post.rate,
						currency: post.currency,
						status: 'approved',
						_consumer: consumer._id,
						_consumerTran: customerTransactions[0]._id,
						_campaign: campaign._id,
						_ad: post._ad,
						_post: postID
					}
				}
			},
			{
				new: true
			}
		);

		return;
	},

	async debitConsumer() {
		//
	},

	async creditAccount() {
		//
	}
};
