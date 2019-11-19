const _ = require('lodash');

const Consumer = require('../models/Consumer');
const Campaign = require('../models/Campaign');

const Campaigns = require('./campaigns_controller');

module.exports = {
	async authUser(consumerProps) {
		const existingConsumer = await Consumer.findOne({ providerUID: consumerProps.providerUID });

		if (existingConsumer) return existingConsumer;

		// const affiliateKey = keygen.url();
		const consumer = await new Consumer(consumerProps).save();
		return consumer;
	},

	async index(account, campaignID) {
		// const consumers = await Consumer.find().where('posts._id').exists();

		// consumers.map((consumer) => {
		// 	consumer.posts.map(async (post) => {
		// 		console.log(post._campaign, post._ad);

		// const { _ad } = post;

		// const campaign = await Campaign.findOne({ 'ads._id': _ad });
		// if (!campaign) console.log(_ad);

		// const res = await Consumer.findOneAndUpdate(
		// 	{ 'posts._id': post },
		// 	{
		// 		$set: { 'posts.$._campaign': campaign._id },
		// 		$addToSet: { campaigns: campaign._id }
		// 	}
		// );
		// });
		// });

		// return consumers;

		if (campaignID) {
			return Consumer.find({ campaigns: campaignID }).limit(10);
		} else {
			const campaigns = await Campaigns.findByAccount(account);
			return Consumer.find({ campaigns: { $in: campaigns } }).limit(10);
		}
	},

	async search(query, user) {
		const campaign = await Campaign.findOne({ _user: user });
		const consumers = await Consumer.find({
			'campaigns._campaign': campaign,
			$or: [
				{ email: { $regex: query, $options: 'i' } },
				{ firstName: { $regex: query, $options: 'i' } },
				{ lastName: { $regex: query, $options: 'i' } }
			]
		});

		return consumers;
	},

	async create(consumerProps) {
		let consumer = await Consumer.findOne({ email: consumerProps.email });
		if (!consumer) consumer = await Consumer.create(consumerProps);

		return await Consumer.findByIdAndUpdate(
			consumer,
			{
				$push: { campaigns: { _campaign: consumerProps.campaign } }
			},
			{ new: true }
		);
	},

	async createInvoice({ invoiceProps }) {
		try {
			const { invoices } = await Consumer.findByIdAndUpdate(
				invoiceProps.id,
				{
					$push: { invoices: invoiceProps }
				},
				{ new: true }
			);

			const res = _.sortBy(invoices, [ invoices.datetime ]).reverse();
			return res[0];
		} catch (err) {
			console.log(err);
		}
	},

	async update(consumerProps) {
		const props = ({ firstName, lastName, email, phone, address, campaign } = consumerProps);

		try {
			const consumer = await Consumer.findByIdAndUpdate(consumerProps.id, props, { new: true });

			return consumer;
		} catch (err) {
			console.log(err);
		}
	},

	async delete(consumerProps) {
		try {
			const consumer = await Consumer.findByIdAndUpdate(consumerProps.id, { status: 'archived' }, { new: true });

			return consumer;
		} catch (err) {
			console.log(err);
		}
	}
};
