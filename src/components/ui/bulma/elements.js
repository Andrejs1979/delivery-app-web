import React from 'react';

export function Box({ children }) {
	return <div className="box">{children}</div>;
}

export function Button({ type, action, children, icon, color, size, vertical, block, disabled }) {
	// const onClick = link ? () => navigate(`/${link}/${itemID}`) : () => action(itemID);
	return (
		<div className="control">
			<button
				type={type}
				onClick={action}
				disabled={disabled}
				className={`button is-${color || 'primary'} is-${size || 'normal'} ${!block || 'is-fullwidth'}`}
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

export function Icon({ name, size }) {
	return (
		<span className="icon">
			<i className={`fas ${size === 'large' && 'fa-2x'} fa-${name} is-${size} `} />
		</span>
	);
}

export function Notification({ children, color }) {
	return <div className={`notification is-${color}`}>{children}</div>;
}

export function Progress({ value, color, size }) {
	return <progress value={value} max="100" className={`progress is-${color} is-${size}`} />;
}
