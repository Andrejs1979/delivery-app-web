import React, { useState } from 'react';

import Menu from 'components/ui/Menu';
import Navbar from 'components/ui/Navbar';
// import { Footer } from 'components/ui/bulma';

export default function Layout({ children, location }) {
	const [ extendedMenu, extendMenu ] = useState(false);
	return (
		<div>
			{/* <Navbar extendedMenu={extendedMenu} extendMenu={extendMenu} location={location} /> */}

			<Menu extendedMenu={extendedMenu} extendMenu={extendMenu} />
			{children}
		</div>
	);
}
