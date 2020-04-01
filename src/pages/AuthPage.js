import React, { useEffect, useState, useRef } from 'react';
import * as firebase from 'firebase/app';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { Image, Transformation } from 'cloudinary-react';
import { Box, Button, Columns, Column, Container, Input, Notification } from 'components/ui/bulma';

import logo from 'assets/mark-logo.png';

import { firebaseAppAuth, providers } from 'services/firebase';

const uiConfig = {
	// Popup signin flow rather than redirect flow.
	signInFlow: 'popup',
	signInSuccessUrl: '/',

	signInOptions: [ firebase.auth.PhoneAuthProvider.PROVIDER_ID ]
};

export default function AuthPage() {
	return (
		<section className="hero is-fullheight">
			<div className="hero-body">
				<Container>
					<Columns centered>
						<Column size="half">
							<StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebaseAppAuth} />
						</Column>
					</Columns>
				</Container>
			</div>
		</section>
	);
}
