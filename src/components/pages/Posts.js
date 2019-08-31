import React, { useContext } from 'react';

import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';

import Cards from 'components/ui/Cards';
import { Section } from 'components/ui/bulma/layout';

import UserContext from 'context/UserContext';

const POSTS = gql`
	query Posts($limit: Int, $status: PostStatus) {
		posts(limit: $limit, status: $status) {
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

const APPROVE_POST = gql`
	mutation ApprovePost($postID: ID!) {
		approvePost(postID: $postID) {
			id
		}
	}
`;

const DECLINE_POST = gql`
	mutation DeclinePost($postID: ID!, $statusText: String!) {
		declinePost(postID: $postID, statusText: $statusText) {
			id
		}
	}
`;

export default function Campaigns() {
	const { uid } = useContext(UserContext);
	const headers = { Authorization: `Bearer ${uid}` };

	const [ approvePost, { data: approveData } ] = useMutation(APPROVE_POST, { context: { headers } });
	const [ declinePost, { data: declineData } ] = useMutation(DECLINE_POST, { context: { headers } });
	const { loading, data, error } = useQuery(POSTS, {
		// variables: { email: user.email },
		context: { headers }
	});

	if (loading) return <div>Loading</div>;
	if (error) return <div>{error}</div>;

	return (
		<Section>
			<Cards type="posts" data={data.posts} actions={[ approvePost, declinePost ]} />
		</Section>
	);
}
