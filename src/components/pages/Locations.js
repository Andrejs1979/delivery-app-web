import React, { useContext } from 'react';

import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

import Cards from 'components/ui/Cards';
import Error from 'components/ui/Error';
import Spinner from 'components/ui/Spinner';
//import { Section } from 'components/ui/bulma/layout';

import UserContext from 'context/UserContext';

const LOCATIONS = gql`
	query Locations {
		locations {
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
