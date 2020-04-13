import React, { useEffect, useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { Router } from '@reach/router';

import { useAuthState } from 'react-firebase-hooks/auth';
import { firebaseAppAuth } from 'services/firebase';

import { ModalProvider } from 'react-modal-hook';
import { CloudinaryContext } from 'cloudinary-react';

import Layout from 'components/ui/Layout';
import Spinner from 'components/ui/Spinner';

import Welcome from 'pages/Welcome';
import Locations from 'pages/Locations';
import UserContext from 'context/UserContext';

export default function Account() {
	const [ user ] = useAuthState(firebaseAppAuth);
	const [ code, setCode ] = useState();
	const [ location, setLocation ] = useState();

	const { loading, data, error } = useQuery(CURRENT_USER);
	const [ updateUser ] = useMutation(UPDATE_USER);

	useEffect(
		() => {
			if (user && data && data.user) {
				const userProps = { id: data.user.id, phone: user.phoneNumber, email: user.email };

				updateUser({ variables: { userProps } });
			}
		},
		[ user, data ]
	);

	if (loading) return <Spinner />;
	if (error) return <div>{error.message}</div>;

	return (
		<CloudinaryContext cloudName="fastlabs">
			<ModalProvider>
				<Router>
					{code ? (
						<Welcome path="/" code={code} setCode={setCode} />
					) : (
						<Locations path="/" location={location} setLocation={setLocation} />
					)}
				</Router>
			</ModalProvider>
		</CloudinaryContext>
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
