import React, { useContext } from 'react';

import { gql, useQuery } from '@apollo/client';
import { useModal } from 'react-modal-hook';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from '@reach/router';

import { useAuthState } from 'react-firebase-hooks/auth';
import { firebaseAppAuth } from 'services/firebase';

import OrderForm from 'components/forms/Order';

import logo from 'assets/logo.png';

import Error from 'components/ui/Error';
import Spinner from 'components/ui/Spinner';

import { Button } from 'components/ui/bulma';

export default function Navbar({ extendedMenu, extendMenu, location }) {
	const [ user ] = useAuthState(firebaseAppAuth);

	const [ showOrderForm, hideOrderForm ] = useModal(
		() => (
			<div className="modal is-active">
				<div className="modal-background" />
				<div className="modal-content">
					<OrderForm address={`${location.address} ${location.text}`} onClose={hideOrderForm} />
				</div>
			</div>
		),
		[ location ]
	);

	return (
		<nav className="navbar box is-light" role="navigation" aria-label="main navigation">
			<div className="navbar-brand">
				<div className="navbar-item">
					<img src={logo} />
				</div>
			</div>

			<div className="navbar-start">
				<div className="navbar-item">
					{location ? (
						<h1 style={{ textAlign: 'center', fontSize: '25px', fontWeight: 'bolder' }}>
							{location.address} {location.text}
						</h1>
					) : (
						<h1 style={{ textAlign: 'center', fontSize: '25px', fontWeight: 'bolder' }}>
							Please look up your address to get started
						</h1>
					)}
				</div>
				<div className="navbar-item">
					{location && (
						<Button size="medium" color="danger" action={() => showOrderForm(location)}>
							Continue
						</Button>
					)}
				</div>
			</div>

			<div id="navbarBasicExample" className="navbar-menu">
				<div id="navbarBasicExample" className="navbar-menu">
					<div className="navbar-end">
						{/* <div className="navbar-item">
							<p className="title is-size-5">Please look up your address to get started</p>
						</div> */}
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
                    </a>{" "}
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
                    <div>
                      <hr className="dropdown-divider" />
                      <a className="dropdown-item" onClick={showCustomerForm}>
                        <span className="icon is-large">
                          <i className="fas fa-address-card fa-lg" />
                        </span>
                        <span className="title is-5">New Campaign</span>
                      </a>
                    </div>
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
								<span className="fa-layers fa-fw fa-2x dropdown-trigger">
									<FontAwesomeIcon icon="user-circle" color="dark" />
									{/* <FontAwesomeIcon
                    icon="angle-down"
                    inverse
                    transform="shrink-6"
                  /> */}
								</span>

								<div className="dropdown-menu" id="dropdown-menu4" role="menu">
									<div className="dropdown-content">
										<span className="dropdown-item">{user.email}</span>
										<span className="dropdown-item">{user.phoneNumber}</span>

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
