import React, { useContext } from 'react';

import { gql, useQuery } from '@apollo/client';

// import { Container } from 'components/ui/bulma';
// import { Content } from 'components/ui/bulma';
import Cards from 'components/ui/Cards';
import Error from 'components/ui/Error';
import Spinner from 'components/ui/Spinner';

import UserContext from 'context/UserContext';

const CONSUMERS = gql`
	query Consumers {
		consumers {
			id
			email
			avatar
			firstName
			lastName
			postCount
		}
	}
`;

export default function Campaigns() {
	const { headers } = useContext(UserContext);

	const { loading, data, error } = useQuery(CONSUMERS, {
		// variables: { email: user.email },
		context: { headers }
	});

	if (loading) return <Spinner />;
	if (error) return <Error error={error} />;

	return <Cards type="consumers" data={data.consumers} />;
}
