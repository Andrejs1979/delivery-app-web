import React from 'react';

import Menu from 'components/ui/Menu';
import Navbar from 'components/ui/Navbar';
// import { Footer } from 'components/ui/bulma/layout';

export default function Layout({ children }) {
	return (
		<div className="columns">
			<div className="column is-narrow">
				<Menu />
			</div>
			<div className="column">
				<Navbar />
				{children}
			</div>
			<div className="column is-narrow" />
		</div>
	);
}
