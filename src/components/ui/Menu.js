import React from 'react';
import { Link } from '@reach/router';

function Menu({ title, children }) {
	return (
		<aside className="menu">
			{title && <p className="menu-label">{title}</p>}
			<ul className="menu-list">{children}</ul>
		</aside>
	);
}
function MenuItem({ name, icon, route }) {
	return (
		<li>
			<Link to={route}>
				<span className="icon">
					<i className={`fas fa-${icon} is-small`} />
				</span>{' '}
				<strong>{name}</strong>
			</Link>
		</li>
	);
}

export default function SidePanel() {
	return (
		<Menu>
			<MenuItem name="Dashboard" icon="tachometer-alt" route="/" />
			<MenuItem name="Posts" icon="images" route="/posts" />
			<MenuItem name="Locations" icon="map-marker-alt" route="/locations" />
			{/* <MenuItem name="Campaigns" icon="globe" route="/campaigns" /> */}
			<MenuItem name="Ads" icon="map-marker-alt" route="/ads" />
			<MenuItem name="Consumers" icon="user-friends" route="/consumers" />
			<MenuItem name="Transactions" icon="map-marker-alt" route="/transactions" />
		</Menu>
	);
}
