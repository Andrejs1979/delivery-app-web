import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from '@reach/router';

import UserContext from 'context/UserContext';

export default function SidePanel({ extendedMenu, extendMenu }) {
	return <ExtendedMenu extendedMenu={extendedMenu} extendMenu={extendMenu} />;
}

function ExtendedMenu({ extendedMenu, extendMenu }) {
	return (
		<div className="block">
			<div className={`navigation-view  ${extendedMenu ? 'is-active' : ''}`} id="myNavigationView">
				<div className="navbar-brand">
					<Link to="/">
						<span className="icon is-large has-text-primary">
							<span className="fa-stack fa-lg">
								<i className="fas fa-square fa-stack-2x" />
								<i className="fas fa-map-marker-alt fa-stack-1x fa-inverse" />
							</span>
						</span>
					</Link>
					<a
						className={`navbar-burger ${extendedMenu ? 'is-active' : ''}`}
						id="myToggleButton"
						role="button"
						aria-expanded="false"
						aria-label="menu"
						onClick={() => extendMenu(!extendedMenu)}
					>
						<span aria-hidden="true" />
						<span aria-hidden="true" />
						<span aria-hidden="true" />
					</a>
				</div>

				<Menu>
					<MenuItem extended name="About" icon="tachometer-alt" route="/" />
					{/* <MenuItem extended name="Campaigns" icon="globe" route="/campaigns" />
						<MenuItem extended name="Posts" icon="images" route="/posts" />
						<MenuItem extended name="Locations" icon="map-marked-alt" route="/locations" />
						<MenuItem extended name="Ads" icon="ad" route="/ads" />
						<MenuItem extended name="Promoters" icon="user-friends" route="/consumers" />
						<MenuItem extended name="Payments" icon="money-check-alt" route="/transactions" /> */}
				</Menu>
			</div>
		</div>
	);
}

function Menu({ title, children }) {
	return (
		<aside className="menu is-dark">
			{title && <p className="menu-label">{title}</p>}
			<ul className="menu-list">{children}</ul>
		</aside>
	);
}
function MenuItem({ extended, name, icon, route }) {
	if (extended) {
		return (
			<li>
				<Link to={route}>
					<p className="is-size-4 has-text-weight-semibold">{name}</p>
				</Link>
			</li>
		);
	} else
		return (
			<li className="has-text-centered">
				<Link to={route}>
					<FontAwesomeIcon icon={icon} color="black" size="lg" />
					<p className="is-size-7 has-text-weight-semibold">{name}</p>
				</Link>
			</li>
		);
}
