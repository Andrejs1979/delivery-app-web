import React from 'react';

import CampaignWizard from 'components/forms/CampaignWizard';

import { Box } from 'components/ui/bulma/elements';

export default function Welcome() {
	return (
		<div className="columns is-centered">
			<div className="column is-half-desktop is-full-mobile">
				<div className="is-hidden-mobile">
					<br />
					<br />
					<br />
					{/* <nav className="navbar is-transparent is-light is-hidden-mobile">
							<div className="navbar-brand">
								<span className="icon is-large has-text-primary">
									<span className="fa-stack fa-lg">
										<i className="fas fa-square fa-stack-2x" />
										<i className="fas fa-map-marker-alt fa-stack-1x fa-inverse" />
									</span>
								</span>
								<div className="navbar-item">
									<h1 className="title">Your campaign</h1>
									<br />
								</div>
							</div>
						</nav> */}
				</div>
				<Box>
					<CampaignWizard />
				</Box>
				<p>© 2019 Cashmark</p>
			</div>
		</div>
	);
}
