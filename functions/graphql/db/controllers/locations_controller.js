const _ = require('lodash');

const { City, Campaign, Location } = require('../models');
// const Campaigns = require('./campaigns_controller');

const foursquare = require('../../services/foursquare');
// const getLocations = require("../../services/getLocations");

const delay = (interval) => new Promise((resolve) => setTimeout(resolve, interval));

module.exports = {
	async index(account, campaignID, status) {
		if (campaignID) {
			return Location.find({ campaigns: campaignID }).limit(100);
		} else {
			// const campaigns = await Campaigns.findByAccount(account);
			const campaigns = await Campaign.find({ _account: account });
			return Location.find({ campaigns: { $in: campaigns } }).limit(100);
		}
	},
	async currentLocation(locationGeoProps, radius) {
		try {
			const locations = await Location.aggregate([
				{
					$geoNear: {
						near: locationGeoProps,
						spherical: true,
						maxDistance: radius,
						distanceField: 'distance',
						limit: 1
					}
				},

				{
					$lookup: {
						from: 'campaigns',
						localField: 'campaigns',
						foreignField: '_id',
						as: 'campaigns'
					}
				}
			]);

			// return locations.map(location => location.campaigns[0].isLive = true && location)
			return locations;
		} catch (err) {
			console.log(err);
		}
	},
	async locationsByGeo(searchAreaProps, radius) {
		try {
			const locations = await Location.aggregate([
				{
					$geoNear: {
						near: searchAreaProps,
						spherical: true,
						maxDistance: radius,
						distanceField: 'distance'
					}
				},

				{
					$lookup: {
						from: 'campaigns',
						localField: 'campaigns',
						foreignField: '_id',
						as: 'campaigns'
					}
				}
			]);

			// return locations.map(location => location.campaigns[0].isLive = true && location)
			return locations;
		} catch (err) {
			console.log(err);
		}
	},

	async create(locationProps, campaignID) {
		const [ location ] = await Location.aggregate([
			{
				$geoNear: {
					near: locationProps.geometry,
					spherical: true,
					maxDistance: 10,
					distanceField: 'distance'
				}
			}
		]);

		if (location && location.address === locationProps.address) {
			try {
				const assets = {
					logoURI: 'defaultLocationIcon.png',
					defaultPictureURI: 'defaultPicture.png'
				};

				const location = { ...locationProps, assets };

				return Location.findByIdAndUpdate(location, {
					location,
					$addToSet: { campaigns: campaignID }
				});
			} catch (error) {
				console.log(error);
			}
		} else {
			try {
				const loc = await Location.create(locationProps);
				return Location.findByIdAndUpdate(loc, {
					$addToSet: { campaigns: campaignID }
				});
			} catch (error) {
				console.log(error);
			}
		}
	},

	async createMultiple(locations, campaignID) {
		const assets = {
			logoURI: 'defaultLocationIcon.png',
			defaultPictureURI: 'defaultPicture.png'
		};

		return locations.map(async (location) => {
			const { address, city, state, zip, country } = location;

			const exists = await Location.findOne({ address, city, state, zip, country });

			if (exists && campaignID)
				try {
					return Location.findByIdAndUpdate(
						exists,
						{
							$addToSet: { campaigns: campaignID }
						},
						{ new: true }
					);
				} catch (error) {
					console.log(error);
				}

			if (!exists)
				try {
					return Location.create({ ...location, assets, campaigns: [ campaignID ] });
				} catch (error) {
					console.log(error);
				}
		});
	},

	async populate(campaignID, searchString) {
		let counter = 0;
		const cities = await City.find().limit(1000);

		cities.map(async (city) => {
			await delay(1000);
			counter++;
			const searchArea = `${city.city},${city.state}`;

			let locations = [];

			try {
				locations = await foursquare.locations(searchString, searchArea);
			} catch (err) {
				console.log(err);
			}

			if (locations && locations.length > 0) {
				locations.map(async (location) => {
					const exists = await Location.findOne({
						sourceID: location.sourceID
					});

					if (exists) {
						console.log('Location exists', location.city, location.state, location.sourceID);
					} else {
						try {
							const addedLocation = await Location.create(location);

							if (addedLocation._id)
								await Location.findByIdAndUpdate(addedLocation._id, {
									$push: {
										campaigns: campaignID
									}
								});
						} catch (err) {
							console.log(err);
						}

						console.log('Location added:', location.city, location.state);
					}
				});
			} else {
				console.log('No locations found');
			}
		});
		return;
	}
};
