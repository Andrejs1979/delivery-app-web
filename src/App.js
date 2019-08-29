import './App.sass';
import React from 'react';
import ApolloClient from 'apollo-boost';

import { ApolloProvider } from '@apollo/react-hooks';
import { useAuthState } from 'react-firebase-hooks/auth';

import Auth from 'components/pages/AuthPage';
import Account from 'components/Account';

import { firebaseAppAuth } from 'services/firebase';

const API_URL = process.env.REACT_APP_API_ROOT_URL + '/graphql';

const client = new ApolloClient({
	uri: API_URL
});

export default function App() {
	const [ user, loading, error ] = useAuthState(firebaseAppAuth);

	if (loading) {
		return (
			<div>
				<p>Please wait...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div>
				<p>Error: {error}</p>
			</div>
		);
	}

	return <ApolloProvider client={client}>{user ? <Account /> : <Auth />}</ApolloProvider>;
}
