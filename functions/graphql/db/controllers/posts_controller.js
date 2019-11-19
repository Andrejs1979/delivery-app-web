const _ = require('lodash');

const Campaign = require('../models/Campaign');
const Consumer = require('../models/Consumer');

const Campaigns = require('./campaigns_controller');
const Transactions = require('./transactions_controller');
lookUpCampaignByUser = (user) => {
	try {
		return Campaign.findOne({
			_user: user
		});
	} catch (err) {
		console.log(err);
	}
};

module.exports = {
	async index(account, status, limit, campaignID) {
		// console.log(account, status, limit, campaignID);

		let campaigns = [];
		if (campaignID) {
			campaigns = [ campaignID ];
		} else {
			campaigns = await Campaigns.findByAccount(account);
		}

		const consumers = await Consumer.find({ campaigns: { $in: campaigns } })
			.sort({ 'posts.createdAt': -1 })
			.select('-_id posts')
			.lean();

		const posts = consumers
			.map((consumer) => consumer.posts)
			.flat()
			.filter((post) => (campaignID ? post._campaign === campaignID : post))
			.filter((post) => (status ? post.status === status : post));

		posts.map((post) => {
			if (posts.status === 'pending') console.log(posts);
		});

		return _.sortBy(posts, [ posts.createdAt ]).reverse();
	},

	async create(postProps) {
		try {
			const { posts } = await Consumer.findByIdAndUpdate(
				postProps.consumer,
				{
					$push: {
						posts: {
							_location: postProps.location,
							_ad: postProps.ad,
							_campaign: postProps.campaign,
							uri: postProps.uri,
							rate: postProps.rate,
							currency: postProps.currency
						}
					},
					$addToSet: { campaigns: postProps.campaign }
				},
				{
					new: true
				}
			);

			const res = _.sortBy(posts, [ posts.createdAt ]).reverse();
			return res[0];
		} catch (err) {
			console.log(err);
		}
	},

	async approve(postID) {
		try {
			await Transactions.creditConsumer(postID);
		} catch (error) {
			console.log(error);
		}

		const consumer = await Consumer.findOneAndUpdate(
			{ 'posts._id': postID },
			{ $set: { 'posts.$.status': 'approved' } },
			{ new: true }
		);

		const post = consumer.posts.id(postID);

		return post;
	},

	async decline(postID, statusText) {
		const consumer = await Consumer.findOneAndUpdate(
			{ 'posts._id': postID },
			{
				$set: {
					'posts.$.status': 'declined',
					'posts.$.statusText': statusText
				}
			},
			{ new: true }
		);

		return consumer.posts.id(postID);
	},

	async findPostByID(postID) {
		const { posts } = await Consumer.findOne({ 'posts._id': postID }).select('-_id posts').lean();
		return posts.pop();
	},

	async findPostsByLocation(_location) {
		const consumers = await Consumer.find({
			'posts._location': _location
		}).select('posts');

		let posts = [];
		consumers.map((consumer) => {
			if (consumer.posts.length > 0) posts = posts.concat(consumer.posts);
			if (posts.length > 0) return posts;
		});
		return posts;
	},

	async findPostsByCampaign(_campaign) {
		const consumers = await Consumer.find({
			'posts._campaign': _campaign
		}).select('posts');

		let posts = [];
		consumers.map((consumer) => {
			if (consumer.posts.length > 0) posts = posts.push(consumer.posts);
			if (posts.length > 0) return posts;
		});

		return posts;
	}
};
