import React, { useContext } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
// import { useModal } from 'react-modal-hook';
import { Link } from '@reach/router';
import { firebaseAppAuth } from 'services/firebase';

import Error from 'components/ui/Error';
import Spinner from 'components/ui/Spinner';

// import { Button } from 'components/ui/bulma/elements';

import UserContext from 'context/UserContext';

export default function Navbar({ extendedMenu, extendMenu }) {
	const { headers, user } = useContext(UserContext);

	const { loading, data, error } = useQuery(ACCOUNT, {
		context: { headers }
	});

	// const [ showCustomerForm, hideCustomerForm ] = useModal(() => (
	// 	<div className="modal is-active">
	// 		<div className="modal-background" />
	// 		<div className="modal-content">{/* <CustomerForm onClose={hideCustomerForm} /> */}</div>
	// 	</div>
	// ));

	if (loading) return <Spinner />;
	if (error) return <Error error={error} />;

	const { account: { name, campaigns } } = data;

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
					<div className="navbar-item">
						<Link to="/">
							<p className="title is-4">{name}</p>
						</Link>
					</div>
					{campaigns && campaigns.length > 1 ? (
						<div className="navbar-item has-dropdown is-hoverable">
							<span className="navbar-link">
								<strong>All Campaigns</strong>
							</span>

							<div className="navbar-dropdown">
								{campaigns.map((campaign) => (
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
						{/* <div className="navbar-item">
							<div className="dropdown is-hoverable is-right">
								<div className="dropdown-trigger">
									<button
										className="button is-primary"
										aria-haspopup="true"
										aria-controls="dropdown-menu"
									>
										<span className="icon">
											<i className="fas fa-plus-circle" aria-hidden="true" />
										</span>
										<span>
											<strong>Create</strong>
										</span>
										<span className="icon is-small">
											<i className="fas fa-angle-down" aria-hidden="true" />
										</span>
									</button>
								</div>
								<div className="dropdown-menu" id="dropdown-menu" role="menu">
									<div className="dropdown-content">
										<a className="dropdown-item" onClick={showPaymentFormModal}>
											<span className="icon is-large">
												<i className="fas fa-credit-card fa-lg" />
											</span>
											<span className="title is-5">New locations</span>
										</a>{' '}
										<a className="dropdown-item" onClick={showInvoiceForm}>
											<span className="icon is-large">
												<i className="fas fa-paperclip fa-lg" />
											</span>
											<span className="title is-5">Promo</span>
										</a>
										<a className="dropdown-item" onClick={showCustomerForm}>
											<span className="icon is-large">
												<i className="fas fa-address-card fa-lg" />
											</span>
											<span className="title is-5">Invite Customers</span>
										</a>
										{type === 'sme' || (
											<div>
												<hr className="dropdown-divider" />
												<a className="dropdown-item" onClick={showCustomerForm}>
													<span className="icon is-large">
														<i className="fas fa-address-card fa-lg" />
													</span>
													<span className="title is-5">New Campaign</span>
												</a>
											</div>
										)}
									</div>
								</div>
							</div>
						</div> */}

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
										<span className="dropdown-item">{user.email}</span>

										<hr className="dropdown-divider" />
										<a className="dropdown-item" onClick={() => firebaseAppAuth.signOut()}>
											<strong>Log Out</strong>
										</a>
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

const ACCOUNT = gql`
	query Account {
		account {
			id
			name
			status
			campaigns {
				id
				name
				status
			}
		}
	}
`;
