import React from 'react';

export function Container({ children }) {
	return <div className="container">{children}</div>;
}
export function Columns({ children }) {
	return <div className="columns">{children}</div>;
}

export function Footer({ children }) {
	return (
		<footer className="footer">
			<div className="content has-text-centered">{children}</div>
		</footer>
	);
}
export function Hero({ children }) {
	return (
		<section className="hero is-fullheight">
			<div className="hero-body">
				<div className="container">{children}</div>
			</div>
		</section>
	);
}
export function Section({ children }) {
	return (
		<section className="section">
			<div className="container">{children}</div>
		</section>
	);
}
