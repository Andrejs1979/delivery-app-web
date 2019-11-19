const _ = require('lodash');
const mongoose = require('mongoose');

const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

const Campaign = mongoose.model('campaigns');
const Consumer = mongoose.model('consumers');
const Location = mongoose.model('locations');

const { Accounts, Ads, Campaigns, Consumers, Locations, Posts, Users } = require('../db/controllers');

const resolvers = {
	Date: new GraphQLScalarType({
		name: 'Date',
		description: 'Date custom scalar type',
		parseValue(value) {
			return new Date(value);
		},
		serialize(value) {
			return value.getTime();
		},
		parseLiteral(ast) {
			if (ast.kind === Kind.INT) {
				return parseInt(ast.value, 10); // ast value is always in string format
			}
			return null;
		}
	}),

	Query: {
		ads(root, { campaignID }, { account }, info) {
			if (account) return Ads.index(account, campaignID);
		},

		locationsByGeo(root, { searchAreaProps, radius }, { user }, info) {
			return Locations.locationsByGeo(searchAreaProps, radius);
		},

		currentLocation(root, { locationGeoProps, radius }, { user }, info) {
			return Locations.currentLocation(locationGeoProps, radius);
		},

		consumer(root, { id }, { user }, info) {
			return Consumer.findById(id);
		},

		consumers(root, { campaignID }, { account }, info) {
			if (account) return Consumers.index(account, campaignID);
		},

		posts(root, { limit, status, campaignID }, { account }, info) {
			if (account) return Posts.index(account, status, limit, campaignID);
		},

		post(root, { id }, { account }, info) {
			if (account) return Posts.findPostByID(id);
		},

		locations(root, { campaignID }, { account }, info) {
			if (account) return Locations.index(account, campaignID);
		},

		location(root, { id }, { token }, info) {
			if (token) return Campaign.findById(id);
		},

		transactions(root, args, { token }, info) {
			if (token) return;
		},

		transaction(root, { id }, { token }, info) {
			if (token) return;
		},

		campaigns(root, args, { account }, info) {
			if (account) return Campaigns.findByAccount(account);
		},

		campaign(root, { id }, { account }, info) {
			if (account) return Campaign.findOne({ _id: id, _account: account });
		},

		account(root, { campaignID }, { token, account }, info) {
			if (account) return account;
		},

		accounts(root, { email }, { token }, info) {
			if (token) return Accounts.findByUser(token, email);
		}
	},

	Mutation: {
		updateUser(root, { userProps }, { token }, info) {
			if (token && token === userProps.uid) return Users.update(userProps);
		},
		onboardAccount(root, { accountProps }, { account }, info) {
			if (account && account._id.toString() === accountProps.id) return Accounts.onboard(accountProps);
		},

		authUser(root, { consumerProps }, { user }, info) {
			return Consumers.authUser(consumerProps);
		},

		createPost(root, { postProps }, { user }, info) {
			return Posts.create(postProps);
		},

		createCard(root, { cardProps }, { account }, info) {
			return Accounts.createCard(cardProps, account);
		},

		createConsumer(root, { consumerProps }, { user }, info) {
			return Consumers.create(consumerProps, user);
		},

		updateConsumer(root, { consumerProps }, { user }, info) {
			return Consumers.update(consumerProps, user);
		},

		createCampaign(root, { campaignProps, populateLocations }, { account }, info) {
			if (account) return Campaigns.create(campaignProps, account, populateLocations);
		},

		activateCampaign(root, { campaignProps }, { account }, info) {
			if (account) return Campaigns.update(campaignProps, account);
		},

		updateCampaign(root, { campaignProps }, { account }, info) {
			if (account) return Campaigns.update(campaignProps, account);
		},

		createAd(root, { adProps, campaignID }, { account }, info) {
			if (account) return Ads.create(adProps, campaignID);
		},

		// createLocation(root, { locationProps, campaignID }, { account }, info) {
		// 	if (account) return Locations.create(locationProps, campaignID);
		// },

		createLocations(root, { locations, campaignID }, { account }, info) {
			// if (account)
			return Locations.createMultiple(locations, campaignID);
		},

		activateLocation(root, { locationProps }, { user }, info) {
			return Locations.update(locationProps);
		},

		updateLocation(root, { locationProps }, { user }, info) {
			return Locations.update(locationProps);
		},

		approvePost(root, { postID }, { user }, info) {
			return Posts.approve(postID);
		},

		declinePost(root, { postID, statusText }, { user }, info) {
			return Posts.decline(postID, statusText);
		}
	},

	Account: {
		id: (account) => account._id,
		name: (account) => account.name,
		type: (account) => account.type,
		category: (account) => account.category,
		status: (account) => account.status,
		balance: (account) => account.balance,
		postCount({ _id }, args, { user }, info) {
			return Consumer.find({
				_campaign: _id
			}).count('postCount');
		},
		consumerCount({ _id }, args, { user }, info) {
			return Consumer.find({
				_campaign: _id
			}).count('declinedCount');
		},
		locationCount: (account) => account.locationCount,
		campaigns(root, args, { account }, info) {
			return Campaigns.findByAccount(account);
		},
		consumers(root, { campaignID }, { account }, info) {
			return Consumers.index(account, campaignID);
		},
		locations(root, { campaignID, status }, { account }, info) {
			return Locations.index(account, campaignID, status);
		},
		posts({ _id }, { limit, status, campaignID }, { account }, info) {
			return Posts.index(account, status, limit, campaignID);
		}
	},

	Ad: {
		id: (ad) => ad._id,
		rate: (ad) => ad.rate,
		currency: (ad) => ad.currency,
		creativeURI: (ad) => ad.creativeURI,
		radius: (ad) => ad.radius,
		status: (ad) => ad.status
	},

	Assets: {
		id: (assets) => assets._id,
		logoURI: (assets) => assets.logoURI,
		defaultPictureURI: (assets) => assets.defaultPictureURI
	},

	Campaign: {
		id: (campaign) => campaign._id,
		name: (campaign) => campaign.name,
		hashtag: (campaign) => campaign.hashtag,
		cooldown: (campaign) => campaign.cooldown,
		logoURI: (campaign) => campaign.logoURI,
		ads: (campaign) => campaign.ads.map((ad) => ad),
		status: (campaign) => campaign.status,
		isLive: (campaign) => campaign.isLive,
		limit: (campaign) => campaign.limit,
		locations({ _id }, args, { account }, info) {
			return Locations.index(account, _id);
		},
		posts({ _id }, args, { user }, info) {
			return Posts.findPostsByCampaign(_id);
		},
		consumers({ _id }, args, { user }, info) {
			return Consumer.find({
				'campaigns._campaign': _id
			});
		},
		transactions: (campaign) => campaign.transactions.map((transaction) => transaction),
		postCount({ _id }, args, { user }, info) {
			return Consumer.find({
				_campaign: _id
			}).count('postCount');
		},
		consumerCount({ _id }, args, { user }, info) {
			return Consumer.find({
				_campaign: _id
			}).count('declinedCount');
		}
	},

	Consumer: {
		id: (consumer) => consumer._id,
		provider: (consumer) => consumer.provider,
		providerUID: (consumer) => consumer.providerUID,
		provider: (consumer) => consumer.provider,
		status: (consumer) => consumer.status,
		email: (consumer) => consumer.email,
		displayName: (consumer) => consumer.displayName,
		firstName: (consumer) => consumer.firstName,
		lastName: (consumer) => consumer.lastName,
		avatar: (consumer) => consumer.avatar,
		balance(consumer, args, { user }, info) {
			let balance = 0;
			consumer.transactions.map((transaction) => {
				if (transaction.type === 'payment') {
					balance = balance + Number(transaction.amount);
				} else {
					balance = balance - Number(transaction.amount);
				}
			});
			return balance;
		},
		phone: (consumer) => consumer.phone,
		address: (consumer) => consumer.address,
		country: (consumer) => consumer.country,
		posts: (consumer) => _.sortBy(consumer.posts, [ consumer.posts.createdAt ]).reverse(),
		transactions: (consumer) => _.sortBy(consumer.transactions, [ consumer.transactions.createdAt ]).reverse(),
		campaigns(consumer, args, { account }, info) {
			return consumer.campaigns.map((campaign) => {
				return Campaign.findById(campaign).lean();
			});
		},
		postCount(consumer, args, { user }, info) {
			let count = 0;
			consumer.posts.map((post) => count++);
			return count;
		},
		approvedCount(consumer, args, { user }, info) {
			let count = 0;
			consumer.posts.map((post) => post.status === 'approved' && count++);
			return count;
		}
	},

	Geo: {
		id: (geo) => geo._id,
		type: (geo) => geo.type,
		coordinates: (geo) => geo.coordinates.map((grid) => grid)
	},

	Location: {
		id: (location) => location._id,
		name: (location) => location.name,
		campaigns({ campaigns }, args, { user }, info) {
			return Campaign.find({ _id: { $in: campaigns } }).lean();
		},
		category: (location) => location.category,
		address: ({ address }) => address,
		city: ({ city }) => city,
		state: ({ state }) => state,
		zip: ({ zip }) => zip,
		country: ({ country }) => country,
		distance: ({ distance }) => distance,
		geometry: (location) => location.geometry,
		assets: (location) => location.assets,
		verified: (location) => location.verified,
		active: (location) => location.active,
		posts(location, args, { user }, info) {
			return Posts.findPostsByLocation(location._id);
		}
	},

	Post: {
		id: (post) => {
			// console.log(post);

			return post._id;
		},
		date: (post) => post.createdAt,
		uri: (post) => post.uri,
		rate: (post) => post.rate,
		currency: (post) => post.currency,
		status: (post) => post.status,
		statusText: (post) => post.statusText,
		campaign({ _id }, args, { user }, info) {
			return Campaigns.findByPost(_id);
		},
		ad({ _id }, args, { user }, info) {
			return Ads.findByPost(_id);
		},
		location({ _location }, args, { user }, info) {
			return Location.findById(_location);
		},
		consumer({ _id }, args, { user }, info) {
			return Consumer.findOne({ 'posts._id': _id });
		}
	},

	Transaction: {
		id: (transaction) => transaction._id,
		type: (transaction) => transaction.type,
		campaign({ _campaign }, args, { user }, info) {
			return Campaign.findById(_campaign);
		},
		consumer({ _id }, args, { user }, info) {
			return Consumer.findOne({ 'transactions._id': _id });
		},
		amount: (transaction) => transaction.amount,
		currency: (transaction) => transaction.currency,
		status: (transaction) => transaction.status
	}
};

module.exports = resolvers;
