import React from 'react';

import CampaignWizard from 'components/forms/CampaignWizard';

import { Hero } from 'components/ui/bulma/layout';
import { Box } from 'components/ui/bulma/elements';

export default function Welcome() {
	return (
		<Hero>
			<div className="columns is-mobile is-centered">
				<div className="column">
					<nav className="navbar">
						<div className="navbar-brand">
							<span className="icon is-large has-text-primary">
								<span className="fa-stack fa-lg">
									<i className="fas fa-square fa-stack-2x" />
									<i className="fas fa-map-marker-alt fa-stack-1x fa-inverse" />
								</span>
							</span>
							<div className="navbar-item">
								<h1 className="title">Create your first promo campaign</h1>
								<br />
							</div>
						</div>
					</nav>

					<Box>
						<CampaignWizard />
					</Box>
					<p>© 2019 Cashmark</p>
				</div>
			</div>
		</Hero>
	);
}
