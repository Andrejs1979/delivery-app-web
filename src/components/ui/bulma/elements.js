import React from 'react';

export function Box({ children }) {
	return <div className="box">{children}</div>;
}
export function Content({ children }) {
	return <div className="content">{children}</div>;
}

export function Button({ children, icon, color, size }) {
	return (
		<div className="control">
			<button className={`button is-${color} is-${size}`}>
				<span className="icon">
					<i className={`fas fa-${icon} is-${size}`} />
				</span>
				<span>
					<strong>{children}</strong>
				</span>
			</button>
		</div>
	);
}

export function Delete() {
	return <button className="delete" />;
}

export function Icon({ name, size }) {
	return (
		<span className="icon">
			<i className={`fas fa-${name} is-${size} `} />
		</span>
	);
}

export function Notification({ children }) {
	return <div className="notification is-danger">{children}</div>;
}
