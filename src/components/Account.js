import React, { useEffect } from 'react';

import { gql, useQuery, useMutation } from '@apollo/client';

import { Router } from '@reach/router';

import { useAuthState } from 'react-firebase-hooks/auth';
import { firebaseAppAuth } from 'services/firebase';

import { ModalProvider } from 'react-modal-hook';
import { CloudinaryContext } from 'cloudinary-react';

import Layout from 'components/ui/Layout';
import Spinner from 'components/ui/Spinner';

// **** Pages ****
import Welcome from 'pages/Welcome';

import Dashboard from 'pages/Dashboard';
import Campaigns from 'pages/Campaigns';
import Consumers from 'pages/Consumers';
import Posts from 'pages/Posts';
import Locations from 'pages/Locations';
import Ads from 'pages/Ads';
import Transactions from 'pages/Transactions';

// **** Profiles ****
import CustomerProfile from 'components/profiles/Customer';
// import TransactionProfile from "components/profiles/Activity";

import UserContext from 'context/UserContext';

export default function Account() {
	const [ user ] = useAuthState(firebaseAppAuth);
	const { loading, data, error } = useQuery(CURRENT_USER);
	const [ updateUser ] = useMutation(UPDATE_USER);

	useEffect(
		() => {
			if (user && data && data.user) {
				const userProps = { id: data.user.id, phone: user.phoneNumber, email: user.email };
				console.log(userProps);
				updateUser({ variables: { userProps } });
			}
		},
		[ user, data ]
	);

	if (loading) return <Spinner />;
	if (error) return <div>{error.message}</div>;

	return (
		<UserContext.Provider value={{ user }}>
			<CloudinaryContext cloudName="hqsczucpx">
				<ModalProvider>
					<Router>
						<Layout path="/">
							{/* <Dashboard path="/" /> */}
							{/* <Campaigns path="/campaigns" /> */}

							{/* <Consumers path="/consumers" /> */}
							{/* <CustomerProfile path="customers/:itemID" /> */}

							{/* <Posts path="/posts" /> */}
							<Locations path="/" />
							{/* <Ads path="/ads" /> */}
							{/* <Transactions path="/transactions" /> */}
						</Layout>
					</Router>
				</ModalProvider>
			</CloudinaryContext>
		</UserContext.Provider>
	);
}

const CURRENT_USER = gql`
	query CurrentUser {
		user {
			id
			phone
			email
		}
	}
`;

const UPDATE_USER = gql`
	mutation UpdateUser($userProps: UserProps) {
		updateUser(userProps: $userProps) {
			id
			phone
			email
		}
	}
`;
