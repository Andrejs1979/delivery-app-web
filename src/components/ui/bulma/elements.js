import React from 'react';

export function Box({ children }) {
	return <div className="box">{children}</div>;
}

export function Button({ type, action, children, icon, color, size, vertical, block, loading, disabled }) {
	// const onClick = link ? () => navigate(`/${link}/${itemID}`) : () => action(itemID);
	return (
		<div className="control">
			<button
				type={type}
				onClick={action}
				disabled={disabled}
				className={`button is-${color || 'primary'} is-${size || 'normal'} ${!block ||
					'is-fullwidth'} ${!loading || 'is-loading'}`}
			>
				{icon && (
					<span className="icon">
						<i className={`fas fa-${icon} is-${size}`} />
					</span>
				)}
				<span>
					<strong>{children}</strong>
				</span>
			</button>
		</div>
	);
}

export function ButtonGroup({ children, attached, centered, right }) {
	return (
		<div className={`buttons ${!attached || 'has-addons'} ${!centered || 'is-centered'} ${!right || 'is-right'}`}>
			{children}
		</div>
	);
}

export function Content({ children }) {
	return <div className="content">{children}</div>;
}

export function Delete() {
	return <button className="delete" />;
}

export function Icon({ brand, name, size = '', color = 'grey', container }) {
	return (
		<span className={`icon is-${container}`}>
			<i className={`${!brand ? 'fas' : 'fab'} fa-${name} fa-${size} has-text-${color}`} />
		</span>
	);
}

export function Notification({ children, color }) {
	return <div className={`notification is-${color}`}>{children}</div>;
}

export function Progress({ value, color, size }) {
	return <progress value={value} max="100" className={`progress is-${color} is-${size}`} />;
}

export function Container({ children }) {
	return <div className="container">{children}</div>;
}
export function Columns({ children }) {
	return <div className="columns">{children}</div>;
}
export function Column({ children, size, narrow }) {
	return <div className={`column ${!narrow || 'is-narrow'}`}>{children}</div>;
}

export function Footer({ children }) {
	return (
		<footer className="footer">
			<div className="content has-text-centered">{children}</div>
		</footer>
	);
}
export function Hero({ children, color, size, bold, title, subtitle }) {
	return (
		<section className={`hero is-${color} is-${size} is-${bold}`}>
			<div className="hero-body">
				<div className="container">
					{title && <h1 className="title">{title}</h1>}
					{subtitle && <h2 className="subtitle">{subtitle}</h2>}
					{children}
				</div>
			</div>
		</section>
	);
}
export function Level({ children }) {
	return <nav className="level">{children}</nav>;
}
export function Left({ children }) {
	return <div className="level-left">{children}</div>;
}
export function Right({ children }) {
	return <div className="level-right">{children}</div>;
}
export function Item({ children }) {
	return <div className="level-item">{children}</div>;
}

export function Section({ children }) {
	return (
		<section className="section">
			<div className="container">{children}</div>
		</section>
	);
}

export function Tiles({ children }) {
	return <div className="tile is-ancestor">{children}</div>;
}

export function Vertical({ children, size }) {
	return <div className={`tile is-vertical is-${size}`}>{children}</div>;
}
