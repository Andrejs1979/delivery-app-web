import React, { useContext } from 'react';

import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

import Cards from 'components/ui/Cards';
import { Section } from 'components/ui/bulma/layout';

import UserContext from 'context/UserContext';

const POSTS = gql`
	query Posts {
		posts {
			id
			date
			status
			uri
			consumer {
				id
				avatar
				displayName
			}
		}
	}
`;

export default function Campaigns() {
	const user = useContext(UserContext);

	const { loading, data, error } = useQuery(POSTS, {
		// variables: { email: user.email },
		context: { headers: { Authorization: `Bearer ${user.uid}` } }
	});

	if (loading) return <div>Loading</div>;
	if (error) return <div>{error}</div>;

	return (
		<Section>
			<Cards type="posts" data={data.posts} />
		</Section>
	);
}
