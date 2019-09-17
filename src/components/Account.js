import React from 'react';

import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

import { Router } from '@reach/router';

// import Drift from 'react-driftjs';

import { ModalProvider } from 'react-modal-hook';
import { useAuthState } from 'react-firebase-hooks/auth';
import { firebaseAppAuth } from 'services/firebase';

import Layout from 'components/ui/Layout';

import AccountSetup from 'components/AccountSetup';
import CampaignSetup from 'components/CampaignWizard';

import Dashboard from 'components/pages/Dashboard';
import Campaigns from 'components/pages/Campaigns';
import Consumers from 'components/pages/Consumers';
import Posts from 'components/pages/Posts';
import Locations from 'components/pages/Locations';
import Ads from 'components/pages/Ads';
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
			campaigns {
				id
			}
		}
	}
`;

export default function Account() {
	const [ user ] = useAuthState(firebaseAppAuth);
	const headers = { Authorization: `Bearer ${user.uid}` };
	const { loading, data, error } = useQuery(CURRENT_USER, {
		variables: { email: user.email },
		context: { headers }
	});

	if (loading) return <div>Loading</div>;
	if (error) return <div>{error}</div>;

	const account = data.accounts[0];

	return (
		<UserContext.Provider value={{ user, account, headers }}>
			{account.status === 'new' ? (
				<AccountSetup />
			) : (
				<ModalProvider>
					<Router>
						<Layout path="/">
							<Dashboard path="/" />
							<CampaignSetup path="get-started" />
							<Campaigns path="/campaigns" />
							<Consumers path="/consumers" />
							<Posts path="/posts" />
							<Locations path="/locations" />
							<Ads path="/ads" />
							<Transactions path="/transactions" />
						</Layout>
					</Router>
				</ModalProvider>
			)}
			{/* {process.env.NODE_ENV === 'production' && (
				<Drift appId="1034943" userId="1234" attributes={{ email: 'user@example.com', company: 'Acme Inc' }} />
			)} */}
		</UserContext.Provider>
	);
	// return (
	// 	<UserContext.Provider value={{ user, account, headers }}>
	// 		{account.status === 'new' ? (
	// 			<AccountSetup />
	// 		) : account.campaigns.length > 0 ? (
	// 			<ModalProvider>
	// 				<Router>
	// 					<Layout path="/">
	// 						<Dashboard path="/" />
	// 						<Campaigns path="/campaigns" />
	// 						<Consumers path="/consumers" />
	// 						<Posts path="/posts" />
	// 						<Locations path="/locations" />
	// 						<Ads path="/ads" />
	// 						<Transactions path="/transactions" />
	// 					</Layout>
	// 				</Router>
	// 			</ModalProvider>
	// 		) : (
	// 			<div>
	// 				<CampaignSetup />
	// 			</div>
	// 		)}
	// 		{/* {process.env.NODE_ENV === 'production' && (
	// 			<Drift appId="1034943" userId="1234" attributes={{ email: 'user@example.com', company: 'Acme Inc' }} />
	// 		)} */}
	// 	</UserContext.Provider>
	// );
}
