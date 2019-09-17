import React, { useContext } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { Link } from '@reach/router';
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

export default function Navbar({ extendedMenu, extendMenu }) {
	const { headers } = useContext(UserContext);

	const { loading, data, error } = useQuery(ACCOUNT, {
		context: { headers },
		pollInterval: 10000
	});

	if (loading) return <div>Loading</div>;
	if (error) return <div>{error}</div>;

	const { account } = data;

	return (
		<nav className="navbar" role="navigation" aria-label="main navigation">
			<div className="navbar-brand">
				<span className="icon is-large has-text-light" onClick={() => extendMenu(!extendedMenu)}>
					<span className="fa-stack fa-lg">
						<i className="fas fa-square fa-stack-2x" />
						<i className="fas fa-bars fa-stack-1x has-text-grey" />
					</span>
				</span>

				<Link to="/">
					<span className="icon is-large has-text-primary">
						<span className="fa-stack fa-lg">
							<i className="fas fa-square fa-stack-2x" />
							<i className="fas fa-map-marker-alt fa-stack-1x fa-inverse" />
						</span>
					</span>
				</Link>
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
									<span className="navbar-item" key={campaign.id}>
										<strong>{campaign.name}</strong>
									</span>
								))}

								<hr className="navbar-divider" />
								<span className="navbar-item">New Campaign</span>
							</div>
						</div>
					) : (
						''
					)}
				</div>

				<div id="navbarBasicExample" className="navbar-menu">
					<div className="navbar-end">
						<div className="navbar-item">
							<Button icon="coins" color="white">
								<strong>Available: ${account.balance}</strong>
							</Button>
						</div>
						<div className="navbar-item">
							<Button icon="plus-circle" color="primary">
								New Campaign
							</Button>
						</div>

						<div className="navbar-item">
							<div
								className="dropdown is-hoverable is-right"
								aria-haspopup="true"
								aria-controls="dropdown-menu4"
							>
								<span className="icon dropdown-trigger">
									<i className="fas fa-2x fa-user-circle has-text-grey" aria-hidden="true" />
									<i className="fas fa-angle-down" aria-hidden="true" />
								</span>

								<div className="dropdown-menu" id="dropdown-menu4" role="menu">
									<div className="dropdown-content">
										<span className="dropdown-item">Settings</span>

										<hr className="dropdown-divider" />
										<span className="dropdown-item" onClick={() => firebaseAppAuth.signOut()}>
											<strong>Log Out</strong>
										</span>
									</div>
								</div>
							</div>
						</div>
						<div className="navbar-item"> </div>
					</div>
				</div>
			</div>
		</nav>
	);
}
