import React from 'react';

import { Button } from 'components/ui/bulma/elements';

export default function Navbar() {
	return (
		<nav className="navbar is-light" role="navigation" aria-label="main navigation">
			<div className="navbar-brand">
				<a className="navbar-item" href="https://bulma.io">
					<img alt="" src="https://bulma.io/images/bulma-logo.png" width="112" height="28" />
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
		</nav>
	);
}
