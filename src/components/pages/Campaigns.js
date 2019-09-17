import React, { useContext } from 'react';

import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

import Cards from 'components/ui/Cards';
import Error from 'components/ui/Error';

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
	if (error) return <Error error={error} />;

	return <Cards type="campaigns" data={data.campaigns} />;
}