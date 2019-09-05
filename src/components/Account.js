import React from 'react';
import { Router } from '@reach/router';

import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { ModalProvider } from 'react-modal-hook';
import { useAuthState } from 'react-firebase-hooks/auth';
import { firebaseAppAuth } from 'services/firebase';

import Layout from 'components/ui/Layout';

import Dashboard from 'components/pages/Dashboard';
import Campaigns from 'components/pages/Campaigns';
import Consumers from 'components/pages/Consumers';
import Posts from 'components/pages/Posts';
import Locations from 'components/pages/Locations';
import Transactions from 'components/pages/Transactions';

import UserContext from 'context/UserContext';

const CURRENT_USER = gql`
	query CurrentUser($email: String) {
		accounts(email: $email) {
			id
			name
			apiKey
			status
			isLive
		}
	}
`;

export default function Account() {
	const [ user ] = useAuthState(firebaseAppAuth);

	const { loading, data, error } = useQuery(CURRENT_USER, {
		variables: { email: user.email },
		context: { headers: { Authorization: `Bearer ${user.uid}` } }
	});

	if (loading) return <div>Loading</div>;
	if (error) return <div>{error}</div>;

	const context = { user, account: data.accounts[0] };

	return (
		<UserContext.Provider value={context}>
			<ModalProvider>
				<Router>
					<Layout path="/">
						<Dashboard path="/" />
						<Campaigns path="/campaigns" />
						<Consumers path="/consumers" />
						<Posts path="/posts" />
						<Locations path="/locations" />
						<Transactions path="/transactions" />
					</Layout>
				</Router>
			</ModalProvider>
		</UserContext.Provider>
	);
}
