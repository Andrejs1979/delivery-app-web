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
function MenuItem({ extended, name, icon, route }) {
	if (extended) {
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
	} else
		return (
			<li className="has-text-centered">
				<Link to={route}>
					<span className="icon is-large">
						<i className={`fas fa-${icon} fa-lg`} />
					</span>
					<p className="is-size-7 has-text-weight-semibold">{name}</p>
				</Link>
			</li>
		);
}

export default function SidePanel({ extendedMenu, extendMenu }) {
	return (
		<div>
			<Menu>
				<MenuItem name="Dashboard" icon="tachometer-alt" route="/" />
				<MenuItem name="Campaigns" icon="globe" route="/campaigns" />
				<MenuItem name="Posts" icon="images" route="/posts" />
				<MenuItem name="Locations" icon="map-marked-alt" route="/locations" />
				{/* <MenuItem name="Ads" icon="ad" route="/ads" /> */}
				<MenuItem name="Promoters" icon="user-friends" route="/consumers" />
				<MenuItem name="Rewards" icon="money-check-alt" route="/transactions" />
			</Menu>
			<ExtendedMenu extendedMenu={extendedMenu} extendMenu={extendMenu} />
		</div>
	);
}

function ExtendedMenu({ extendedMenu, extendMenu }) {
	return (
		<div className="demo">
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
						<MenuItem extended name="Dashboard" icon="tachometer-alt" route="/" />
						<MenuItem extended name="Campaigns" icon="globe" route="/campaigns" />
						<MenuItem extended name="Posts" icon="images" route="/posts" />
						<MenuItem extended name="Locations" icon="map-marker-alt" route="/locations" />
						<MenuItem extended name="Ads" icon="ad" route="/ads" />
						<MenuItem extended name="Consumers" icon="user-friends" route="/consumers" />
						<MenuItem extended name="Transactions" icon="dollar-sign" route="/transactions" />
					</Menu>
				</div>
			</div>
		</div>
	);
}