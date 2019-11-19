const Campaign = require('../db/models/Campaign');
const Foursquare = require('./foursquare');

module.exports = async (campaign, lon, lat) => {
	const result = [];
	if (campaign) {
		const locations = await Foursquare.getLocations(campaign, lon, lat);

		locations.forEach(async (location) => {
			result.push(location);

			await Location.findOneAndUpdate(
				{
					sourceID: location.sourceID
				},
				location,
				{
					upsert: true,
					new: true,
					setDefaultsOnInsert: true
				}
			);
			return result;
		});
	} else {
		const campaigns = await Campaign.find({
			status: 'active'
		});

		campaigns.forEach(async (campaign) => {
			const locations = await Foursquare.getLocations(campaign.name, lon, lat);

			locations.forEach(async (location) => {
				result.push(location);

				await Location.findOneAndUpdate(
					{
						sourceID: location.sourceID
					},
					location,
					{
						upsert: true,
						new: true,
						setDefaultsOnInsert: true
					}
				);
			});
		});
	}
};
