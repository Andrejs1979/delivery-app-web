import React, { useContext } from 'react';

import { gql, useQuery } from '@apollo/client';

import Cards from 'components/ui/Cards';
import Error from 'components/ui/Error';
import Spinner from 'components/ui/Spinner';
//import { Section } from 'components/ui/bulma';

import UserContext from 'context/UserContext';

export default function Campaigns() {
	const { headers } = useContext(UserContext);

	const { loading, data, error } = useQuery(LOCATIONS, {
		// variables: { email: user.email },
		context: { headers }
	});

	if (loading) return <Spinner />;
	if (error) return <Error error={error} />;

	return <Cards type="locations" data={data.locations} />;
}

// { "campaignID": "5cdb2c9f6ac4730411eb29ba" }

const LOCATIONS = gql`
	query Locations($campaignID: ID) {
		locations(campaignID: $campaignID) {
			id
			name
			category
			address
			city
			state
			zip
			country
			active
			verified
			campaigns {
				id
			}
			assets {
				id
				logoURI
				defaultPictureURI
			}
		}
	}
`;
