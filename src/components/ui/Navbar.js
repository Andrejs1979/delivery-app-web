import React, { useContext } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

import { useAuthState } from 'react-firebase-hooks/auth';

import { firebaseAppAuth } from 'services/firebase';

import { Button, Icon } from 'components/ui/bulma/elements';

import UserContext from 'context/UserContext';

const CAMPAIGNS = gql`
	query Campaigns {
		campaigns {
			id
			name
			status
		}
	}
`;

export default function Navbar() {
	const { user } = useContext(UserContext);
	const headers = { Authorization: `Bearer ${user.uid}` };

	const { loading, data, error } = useQuery(CAMPAIGNS, {
		context: { headers }
	});

	if (loading) return <div>Loading</div>;
	if (error) return <div>{error}</div>;

	return (
		<nav className="navbar is-light" role="navigation" aria-label="main navigation">
			<div className="navbar-brand">
				<a className="navbar-item" href="/">
					<Icon name="map-marker-alt" size="large" />
					<strong>Cashmark</strong>
					{/* <img alt="" src="https://bulma.io/images/bulma-logo.png" width="112" height="28" /> */}
				</a>

				<button
					className="navbar-burger burger"
					aria-label="menu"
					aria-expanded="false"
					data-target="navbarBasicExample"
				>
					<span aria-hidden="true" />
					<span aria-hidden="true" />
					<span aria-hidden="true" />
				</button>
			</div>

			<div id="navbarBasicExample" className="navbar-menu">
				<div className="navbar-start">
					{data.campaigns && data.campaigns.length > 2 ? (
						<div className="navbar-item has-dropdown is-hoverable">
							<span className="navbar-link">
								<strong>All Campaigns</strong>
							</span>

							<div className="navbar-dropdown">
								{data.campaigns.map((campaign) => (
									<a className="navbar-item" key={campaign.id}>
										<strong>{campaign.name}</strong>
									</a>
								))}

								<hr className="navbar-divider" />
								<a className="navbar-item">New Campaign</a>
							</div>
						</div>
					) : (
						''
					)}
				</div>

				<div id="navbarBasicExample" className="navbar-menu">
					<div className="navbar-end">
						<div className="navbar-item">
							<Button icon="coins" color="light">
								<strong>Available: $50</strong>
							</Button>
						</div>
						<div className="navbar-item">
							<Button icon="plus-circle" color="primary">
								New Campaign
							</Button>
						</div>

						<div
							className="navbar-item  dropdown is-hoverable is-right"
							aria-haspopup="true"
							aria-controls="dropdown-menu4"
						>
							<span className="icon dropdown-trigger">
								<i className="fas fa-2x fa-user-circle has-text-grey" aria-hidden="true" />
								<i className="fas fa-angle-down" aria-hidden="true" />
							</span>

							<div className="dropdown-menu" id="dropdown-menu4" role="menu">
								<div className="dropdown-content">
									<a href="#" className="dropdown-item">
										Settings
									</a>

									<hr className="dropdown-divider" />
									<a href="#" className="dropdown-item" onClick={() => firebaseAppAuth.signOut()}>
										<strong>Log Out</strong>
									</a>
								</div>
							</div>
						</div>

						<div className="navbar-item" />
					</div>
				</div>
			</div>
		</nav>
	);
}
