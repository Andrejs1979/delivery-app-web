import React from 'react';

export default function Spinner() {
	return (
		<section className="hero is-medium">
			<div className="hero-body">
				<div className="container">
					<div className="columns is-centered">
						<div className="column is-one-third has-text-centered">
							<span className="icon is-large has-text-primary">
								<span className="fa-stack fa-lg">
									<i className="fas fa-square fa-stack-2x" />
									<i className="fas fa-map-marker-alt fa-stack-1x fa-inverse" />
								</span>
							</span>
							<br />
							<br />
							<p className="title is-4">One moment, please...</p>
							<progress className="progress is-dark" max="100" />
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
