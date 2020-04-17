import './App.sass';
import React, { useEffect, useState } from 'react';

import analytics from 'react-segment';

import { ApolloProvider, ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { firebaseAppAuth } from 'services/firebase';
// import firebase from 'services/firebase';

import Auth from 'pages/AuthPage';
import Account from 'components/Account';

import Error from 'components/ui/Error';
import Spinner from 'components/ui/Spinner';

import Icons from 'utils/icons';

const PROD = 'https://cloud9-app-api.herokuapp.com/';
// const DEV = 'https://g5m8o3plv8.execute-api.us-east-1.amazonaws.com/dev/graphql';

const auth = firebaseAppAuth;

Icons();

export default function App() {
	const [ user, loading, error ] = useAuthState(firebaseAppAuth);

	useEffect(
		() => {
			!loading && !user && auth.signInAnonymously();
		},
		[ loading, user ]
	);

	if (loading) return <Spinner />;
	if (error) return <Error error={error} />;

	const client = new ApolloClient({
		cache: new InMemoryCache(),
		link: new HttpLink({
			headers: {
				authorization: user ? user.uid : null
			},
			// uri: process.env.REACT_APP_API_ROOT_URL
			// uri: PROD
			uri: 'http://192.168.0.18:5000/graphql'
		})
	});

	return (
		<ApolloProvider client={client}>
			<Account />
		</ApolloProvider>
	);
}
