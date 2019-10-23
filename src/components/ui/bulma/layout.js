import React from 'react';

export function Container({ children }) {
	return <div className="container">{children}</div>;
}
export function Columns({ children }) {
	return <div className="columns">{children}</div>;
}
export function Column({ children, size, narrow }) {
	return <div className={`column ${!narrow || 'is-narrow'} is-${size}`}>{children}</div>;
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
