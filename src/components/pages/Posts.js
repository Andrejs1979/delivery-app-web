import React, { useContext } from 'react';

import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';

import Cards from 'components/ui/Cards';
import Error from 'components/ui/Error';
import Spinner from 'components/ui/Spinner';

import UserContext from 'context/UserContext';

export default function Campaigns() {
	const { headers } = useContext(UserContext);

	const [ approvePost ] = useMutation(APPROVE_POST, {
		context: { headers },
		refetchQueries: [ 'Posts' ]
	});

	const [ declinePost ] = useMutation(DECLINE_POST, { context: { headers }, refetchQueries: [ 'Posts' ] });

	const { loading, data, error } = useQuery(POSTS, {
		variables: { status: 'pending' },
		context: { headers },
		pollInterval: 10000
	});

	if (loading) return <Spinner />;
	if (error) return <Error error={error} />;

	return <Cards type="posts" data={data.posts} actions={[ approvePost, declinePost ]} />;
}

const POSTS = gql`
	query Posts($limit: Int, $status: PostStatus) {
		posts(limit: $limit, status: $status) {
			id
			date
			status
			uri
			location {
				id
			}
			ad {
				id
				creativeURI
			}
			campaign {
				id
			}
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
