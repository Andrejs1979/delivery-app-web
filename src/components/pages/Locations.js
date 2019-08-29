import React, { useContext } from 'react';

import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

import Cards from 'components/ui/Cards';
import { Section } from 'components/ui/bulma/layout';

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
	const user = useContext(UserContext);

	const { loading, data, error } = useQuery(LOCATIONS, {
		// variables: { email: user.email },
		context: { headers: { Authorization: `Bearer ${user.uid}` } }
	});

	if (loading) return <div>Loading</div>;
	if (error) return <div>{error}</div>;

	return (
		<Section>
			<Cards type="locations" data={data.locations} />
		</Section>
	);
}
