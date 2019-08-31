import React, { useContext } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

import { Button } from 'components/ui/bulma/elements';

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
	const { uid } = useContext(UserContext);
	const headers = { Authorization: `Bearer ${uid}` };

	const { loading, data, error } = useQuery(CAMPAIGNS, {
		// variables: { email: user.email },
		context: { headers }
	});

	if (loading) return <div>Loading</div>;
	if (error) return <div>{error}</div>;

	const { campaigns } = data;
	return (
		<nav className="navbar is-light" role="navigation" aria-label="main navigation">
			<div className="navbar-brand">
				<a className="navbar-item" href="/">
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
					<div className="navbar-item has-dropdown is-hoverable">
						<span className="navbar-link">
							<strong>All Campaigns</strong>
						</span>

						<div className="navbar-dropdown">
							{campaigns.map((campaign) => (
								<a className="navbar-item" key={campaign.id}>
									{campaign.name}
								</a>
							))}

							<hr className="navbar-divider" />
							<a className="navbar-item">New Campaign</a>
						</div>
					</div>
				</div>

				<div id="navbarBasicExample" className="navbar-menu">
					<div className="navbar-end">
						<div className="navbar-item">
							<strong>Available: $50</strong>
						</div>
						<div className="navbar-item">
							<div className="buttons">
								<Button icon="plus-circle" color="primary">
									New Campaign
								</Button>
							</div>
						</div>
						<div className="navbar-item"> </div>
					</div>
				</div>
			</div>
		</nav>
	);
}
