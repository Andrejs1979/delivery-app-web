import React from 'react';

import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

import { Router } from '@reach/router';

// import Drift from 'react-driftjs';

import { ModalProvider } from 'react-modal-hook';
import { useAuthState } from 'react-firebase-hooks/auth';
import { firebaseAppAuth } from 'services/firebase';

import Layout from 'components/ui/Layout';
import Spinner from 'components/ui/Spinner';

import Welcome from 'components/pages/Welcome';
import Dashboard from 'components/pages/Dashboard';
import Campaigns from 'components/pages/Campaigns';
import Consumers from 'components/pages/Consumers';
import Posts from 'components/pages/Posts';
import Locations from 'components/pages/Locations';
import Ads from 'components/pages/Ads';
import Transactions from 'components/pages/Transactions';

import UserContext from 'context/UserContext';

export default function Account() {
	const [ user ] = useAuthState(firebaseAppAuth);
	const headers = { Authorization: `Bearer ${user.uid}` };
	const { loading, data, error } = useQuery(CURRENT_USER, {
		variables: { email: user.email },
		context: { headers }
	});

	if (loading) return <Spinner />;
	if (error) return <div>{error}</div>;

	const account = data.accounts[0];

	return (
		<UserContext.Provider value={{ user, account, headers }}>
			<ModalProvider>
				<Router>
					{account.campaigns.length < 1 ? (
						<Welcome path="/" />
					) : (
						<Layout path="/">
							<Dashboard path="/" />
							<Campaigns path="/campaigns" />
							<Consumers path="/consumers" />
							<Posts path="/posts" />
							<Locations path="/locations" />
							<Ads path="/ads" />
							<Transactions path="/transactions" />
						</Layout>
					)}
				</Router>
			</ModalProvider>

			{/* {process.env.NODE_ENV === 'production' && (
				<Drift appId="1034943" userId="1234" attributes={{ email: 'user@example.com', company: 'Acme Inc' }} />
			)} */}
		</UserContext.Provider>
	);
}

const CURRENT_USER = gql`
	query CurrentUser($email: String) {
		accounts(email: $email) {
			id
			name
			apiKey
			status
			isLive
			campaigns {
				id
			}
		}
	}
`;
