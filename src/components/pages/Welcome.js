import React from 'react';

import CampaignWizard from 'components/forms/CampaignWizard';

import { Columns, Container } from 'components/ui/bulma/layout';
import { Box } from 'components/ui/bulma/elements';

import logo from 'assets/mark-logo.png';

export default function Welcome() {
	return (
		<section className="hero is-fullheight">
			<div className="hero-head">
				<nav className="navbar">
					<div className="container">
						<div className="navbar-brand">
							<a className="navbar-item">
								<img src={logo} alt="Mark" />
							</a>
						</div>
					</div>
				</nav>
			</div>

			<div className="hero-body">
				<Container>
					<Columns centered>
						<div className="column is-two-thirds-desktop is-full-mobile">
							<Box>
								<CampaignWizard />
							</Box>
						</div>
					</Columns>
				</Container>
			</div>

			<div className="hero-foot">
				<nav className="is-fullwidth">
					<div className="container">
						<p>© 2019 Mark</p>
					</div>
				</nav>
			</div>
		</section>
	);
}
