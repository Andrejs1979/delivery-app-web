import React, { useContext } from 'react';

import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

import Cards from 'components/ui/Cards';
import { Section } from 'components/ui/bulma/layout';

import UserContext from 'context/UserContext';

const CAMPAIGNS = gql`
	query Campaigns {
		campaigns {
			id
			name
			status
			ads {
				id
			}
		}
	}
`;

export default function Campaigns() {
	const { headers } = useContext(UserContext);

	const { loading, data, error } = useQuery(CAMPAIGNS, {
		context: { headers }
	});

	if (loading) return <div>Loading</div>;
	if (error) return <div>{error}</div>;

	return (
		<Section>
			<Cards type="campaigns" data={data.campaigns} />
		</Section>
	);
}
