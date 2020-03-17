import React, { useContext } from 'react';

import { gql, useQuery } from '@apollo/client';

import Cards from 'components/ui/Cards';
import Error from 'components/ui/Error';
import Spinner from 'components/ui/Spinner';
//import { Section } from 'components/ui/bulma';

import UserContext from 'context/UserContext';

const ADS = gql`
	query Ads($campaignID: ID) {
		ads(campaignID: $campaignID) {
			id
			status
			creativeURI
			radius
			rate
			currency
		}
	}
`;

export default function Ads() {
	const { headers } = useContext(UserContext);

	const { loading, data, error } = useQuery(ADS, {
		// variables: { email: user.email },
		context: { headers }
	});

	if (loading) return <Spinner />;
	if (error) return <Error error={error} />;

	return <Cards type="ads" data={data.ads} />;
}
