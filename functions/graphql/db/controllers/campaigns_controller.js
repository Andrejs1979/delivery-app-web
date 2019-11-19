const { Consumer, Campaign } = require('../models');

const Ads = require('./ads_controller');
const Accounts = require('./accounts_controller');
const Locations = require('./locations_controller');

module.exports = {
	async findByAccount(accountID) {
		return Campaign.find({ _account: accountID });
	},

	async findByPost(postID) {
		const { posts } = await Consumer.findOne({ 'posts._id': postID }).select('-_id posts');
		const post = posts.id(postID);
		if (post._campaign) {
			return Campaign.findById(post._campaign).lean();
		} else {
			return Campaign.findOne({ 'ads._id': post._ad }).lean();
		}
	},
	async create(campaignProps, account, populateLocations) {
		const _account = account._id;

		// const name = campaignProps.name.replace(/\s+/g, '');
		// const assets = {
		// 	logoURI: `${name}.png`,
		// 	defaultPictureURI: `${name}.jpg`
		// };

		try {
			const campaign = await Campaign.create({ ...campaignProps, _account });

			if (populateLocations) {
				await Locations.populate(campaign._id, campaign.name);
			}

			return campaign;
		} catch (err) {
			console.log(err);
		}
	}
};
