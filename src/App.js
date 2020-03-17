import './App.sass';
import React from 'react';

import analytics from 'react-segment';

import { ApolloProvider, ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { firebaseAppAuth } from 'services/firebase';

import Auth from 'pages/AuthPage';
import Account from 'components/Account';

import Error from 'components/ui/Error';
import Spinner from 'components/ui/Spinner';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
	faTachometerAlt,
	faImages,
	faAd,
	faDollarSign,
	faGlobe,
	faUserFriends,
	faMapMarkedAlt,
	faMoneyCheckAlt,
	faSquare,
	faBars,
	faAddressCard,
	faThLarge,
	faTh,
	faUserCircle,
	faAngleDown,
	faCopyright,
	faBullhorn,
	faHashtag,
	faMagic,
	faCoins,
	faLock,
	faAt,
	faCheckCircle,
	faEnvelope
} from '@fortawesome/free-solid-svg-icons';

library.add(
	faTachometerAlt,
	faImages,
	faAd,
	faDollarSign,
	faGlobe,
	faUserFriends,
	faMapMarkedAlt,
	faMoneyCheckAlt,
	faSquare,
	faBars,
	faAddressCard,
	faThLarge,
	faTh,
	faUserCircle,
	faAngleDown,
	faCopyright,
	faBullhorn,
	faHashtag,
	faMagic,
	faCoins,
	faLock,
	faAt,
	faCheckCircle,
	faEnvelope
);

analytics.default.load(process.env.REACT_APP_SEGMENT_KEY);

const PROD = 'https://9o07qpvqn6.execute-api.us-east-1.amazonaws.com/prod/graphql';
const DEV = 'https://csav5txhq2.execute-api.us-east-1.amazonaws.com/dev/graphql';

export default function App() {
	const [ user, loading, error ] = useAuthState(firebaseAppAuth);

	if (loading) return <Spinner />;
	if (error) return <Error error={error} />;

	const client = new ApolloClient({
		cache: new InMemoryCache(),
		link: new HttpLink({
			headers: {
				authorization: user ? user.uid : null
			},
			// uri: process.env.REACT_APP_API_ROOT_URL
			uri: PROD
		})
	});

	return <ApolloProvider client={client}>{user ? <Account /> : <Auth />}</ApolloProvider>;
}
