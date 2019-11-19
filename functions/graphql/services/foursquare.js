const qs = require('qs');
const axios = require('axios');
const keys = require('../config/keys');

const { FSQR_CLIENT_ID, FSQR_CLIENT_SECRET } = keys;

const FSQR_ROOT_URL = 'https://api.foursquare.com/v2';
const PATH = '/venues/search?';

const mapLocations = (searchString, fsqrLocations) => {
	let locations = [];
	const name = searchString.replace(/\s+/g, '');
	const assets = {
		logoURI: `${name}.png`,
		defaultPictureURI: `${name}.jpg`
	};

	if (fsqrLocations.length > 0) {
		fsqrLocations.map((venue) => {
			const location = {
				name: venue.name,
				category: venue.categories[0] ? venue.categories[0].name : null,
				geometry: {
					type: 'Point',
					coordinates: [ venue.location.lng, venue.location.lat ]
				},
				assets,
				address: venue.location.address,
				city: venue.location.city,
				state: venue.location.state,
				zip: venue.location.postalCode,
				country: venue.location.country,
				source: 'foursquare',
				sourceID: venue.id
			};

			// Double-check searchString
			if (location.name === searchString) locations.push(location);
		});
	}
	return locations;
};

module.exports = {
	async locations(searchString, searchLocation) {
		const query = qs.stringify({
			client_id: FSQR_CLIENT_ID,
			client_secret: FSQR_CLIENT_SECRET,
			v: '20180323',
			limit: 50,
			radius: 100000,
			intent: 'browse',
			near: searchLocation,
			query: searchString
		});

		const { data } = await axios.get(FSQR_ROOT_URL + PATH + query);

		const locations = mapLocations(searchString, data.response.venues);
		return locations;
	}
};
