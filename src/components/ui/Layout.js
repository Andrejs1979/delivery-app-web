import React, { useState } from 'react';

import Menu from 'components/ui/Menu';
import Navbar from 'components/ui/Navbar';
// import { Footer } from 'components/ui/bulma';

export default function Layout({ children }) {
	const [ extendedMenu, extendMenu ] = useState(false);
	return (
		<div>
			<Navbar extendedMenu={extendedMenu} extendMenu={extendMenu} />
			<div className="columns">
				<div className="column is-narrow is-hidden-mobile">
					<Menu extendedMenu={extendedMenu} extendMenu={extendMenu} />
				</div>
				<div className="column">
					<br />
					{children}
				</div>
				<div className="column is-narrow" />
			</div>
		</div>
	);
}
