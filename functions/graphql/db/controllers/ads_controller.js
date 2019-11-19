const _ = require('lodash');

const { Consumer, Campaign, Post } = require('../models');
// const sendGrid = require('../../services/sendGrid');

const { Posts, Locations } = require('./');

module.exports = {
	async index(account, campaignID) {
		let res = [];

		const q = campaignID ? { _id: campaignID } : {};
		const campaigns = await Campaign.find(q).where({ _account: account }).select('-_id ads').lean();

		campaigns.map(({ ads }) => {
			res = res.concat(ads);
		});

		return res;
	},

	async findByPost(postID) {
		const { posts } = await Consumer.findOne({ 'posts._id': postID }).select('-_id posts');
		const post = posts.id(postID);
		const { ads } = await Campaign.findOne({ 'ads._id': post._ad }).select('-_id ads');
		return ads.id(post._ad);
	},

	async create(adProps, campaignID) {
		try {
			const { ads } = await Campaign.findByIdAndUpdate(campaignID, { $push: { ads: adProps } }, { new: true })
				.select('-_id ads')
				.lean();

			const [ ad ] = _.orderBy(ads, [ 'createdAt' ], [ 'desc' ]);
			return ad;
		} catch (err) {
			console.log(err);
		}
	}
};
