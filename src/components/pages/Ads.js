import React, { useContext } from 'react';

import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

import Cards from 'components/ui/Cards';
import Error from 'components/ui/Error';
//import { Section } from 'components/ui/bulma/layout';

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

	if (loading) return <div>Loading</div>;
	if (error) return <Error error={error} />;

	return <Cards type="ads" data={data.ads} />;
}
