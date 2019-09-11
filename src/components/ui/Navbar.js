import React, { useContext } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

import { firebaseAppAuth } from 'services/firebase';

import { Button } from 'components/ui/bulma/elements';

import UserContext from 'context/UserContext';

const ACCOUNT = gql`
	query Account {
		account {
			id
			name
			status
			balance
			campaigns {
				id
				name
				status
			}
		}
	}
`;

export default function Navbar() {
	const { headers } = useContext(UserContext);

	const { loading, data, error } = useQuery(ACCOUNT, {
		context: { headers },
		pollInterval: 10000
	});

	if (loading) return <div>Loading</div>;
	if (error) return <div>{error}</div>;

	const { account } = data;

	return (
		<nav className="navbar is-light" role="navigation" aria-label="main navigation">
			<div className="navbar-brand">
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
					{account.campaigns && account.campaigns.length > 2 ? (
						<div className="navbar-item has-dropdown is-hoverable">
							<span className="navbar-link">
								<strong>All Campaigns</strong>
							</span>

							<div className="navbar-dropdown">
								{account.campaigns.map((campaign) => (
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
								<strong>Available: ${account.balance}</strong>
							</Button>
						</div>
						<div className="navbar-item">
							<Button icon="plus-circle" color="primary">
								New Campaign
							</Button>
						</div>

						<div
							className="navbar-item dropdown is-hoverable is-right"
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
					</div>
				</div>
			</div>
		</nav>
	);
}
