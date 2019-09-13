import React, { useContext } from 'react';

import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

// import { Container } from 'components/ui/bulma/layout';
// import { Content } from 'components/ui/bulma/elements';
import Cards from 'components/ui/Cards';
import Error from 'components/ui/Error';

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

	if (loading) return <div>Loading</div>;
	if (error) return <Error error={error} />;

	return <Cards type="consumers" data={data.consumers} />;
}
