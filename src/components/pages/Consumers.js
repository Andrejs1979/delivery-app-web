import React, { useContext } from 'react';

import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

import Cards from 'components/ui/Cards';
import { Section } from 'components/ui/bulma/layout';

import UserContext from 'context/UserContext';

const CONSUMERS = gql`
	query Consumers {
		consumers {
			id
			email
			avatar
			displayName
			postCount
		}
	}
`;

export default function Campaigns() {
	const user = useContext(UserContext);

	const { loading, data, error } = useQuery(CONSUMERS, {
		// variables: { email: user.email },
		context: { headers: { Authorization: `Bearer ${user.uid}` } }
	});

	if (loading) return <div>Loading</div>;
	if (error) return <div>{error}</div>;

	return (
		<Section>
			<Cards type="consumers" data={data.consumers} />
		</Section>
	);
}
