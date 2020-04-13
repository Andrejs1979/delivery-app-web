import React from 'react';
import BounceLoader from 'react-spinners/BounceLoader';

export default function Spinner() {
	return (
		<section className="hero is-fullheight">
			<div className="hero-body">
				<div className="container has-text-centered">
					<div style={{ display: 'inline-block' }}>
						<BounceLoader size={150} color={'#ff3860'} />
					</div>
				</div>
			</div>
		</section>
	);
}
