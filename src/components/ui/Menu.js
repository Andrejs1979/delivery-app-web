import React from 'react';
import { Link } from '@reach/router';

function Menu({ title, children }) {
	return (
		<aside className="menu is-dark">
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
					<i className={`fas fa-${icon}`} />
				</span>{' '}
				<strong>{name}</strong>
			</Link>
		</li>
	);
}

export default function SidePanel() {
	return (
		<Menu>
			<div className="navbar-brand">
				<Link className="navbar-item" to="/">
					<span className="icon is-large has-text-primary">
						<span className="fa-stack fa-lg">
							<i className="fas fa-square fa-stack-2x" />
							<i className="fas fa-map-marker-alt fa-stack-1x fa-inverse" />
						</span>
					</span>
				</Link>

				<button
					className="navbar-burger burger"
					aria-label="menu"
					aria-expanded="false"
					data-target="navbarBasicExample"
				>
					<span aria-hidden="true" />
					<span aria-hidden="true" />
					<span aria-hidden="true" />
				</button>
			</div>
			<MenuItem name="Dashboard" icon="tachometer-alt" route="/" />
			<MenuItem name="Posts" icon="images" route="/posts" />
			<MenuItem name="Locations" icon="map-marker-alt" route="/locations" />
			{/* <MenuItem name="Campaigns" icon="globe" route="/campaigns" />*/}
			<MenuItem name="Ads" icon="ad" route="/ads" />
			<MenuItem name="Consumers" icon="user-friends" route="/consumers" />
			<MenuItem name="Transactions" icon="dollar-sign" route="/transactions" />
		</Menu>
	);
}
