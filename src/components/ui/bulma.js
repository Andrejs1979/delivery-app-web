import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from '@reach/router';
import InputMask from 'react-input-mask';

export function Box({ children }) {
	return <div className="box">{children}</div>;
}

export function Button({
	type,
	action,
	children,
	icon,
	active,
	iconColor,
	color,
	size,
	vertical,
	block,
	outlined,
	rounded,
	loading,
	disabled
}) {
	// const onClick = link ? () => navigate(`/${link}/${itemID}`) : () => action(itemID);
	return (
		<div className="control">
			<button
				type={type}
				onClick={action}
				disabled={disabled}
				className={`button is-${color || 'primary'} is-${size || 'normal'} ${!block ||
					'is-fullwidth'} ${!active || 'is-active'} ${!outlined || 'is-outlined'} ${!rounded ||
					'is-rounded'} ${!loading || 'is-loading'}`}
			>
				{icon && (
					<span className="icon">
						<FontAwesomeIcon icon={icon} size={size} color={iconColor} />
					</span>
				)}
				{children && (
					<span>
						<strong>{children}</strong>
					</span>
				)}
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

export function Container({ children }) {
	return <div className="container">{children}</div>;
}
export function Columns({ children, centered, mobile, multiline, vertical }) {
	return (
		<div
			className={`columns ${!centered || 'is-centered'} ${!vertical || 'is-vcentered'} ${!mobile ||
				'is-mobile'} ${!multiline || 'is-multiline'}`}
		>
			{children}
		</div>
	);
}
export function Column({ children, size, narrow }) {
	return <div className={`column ${!narrow || 'is-narrow'} is-${size}`}>{children}</div>;
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

export function Level({ children, mobile }) {
	return <nav className={`level ${!mobile || 'is-mobile'}`}>{children}</nav>;
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

export function Menu({ label, children }) {
	return (
		<section className="section">
			<div className="container">
				<p className="menu-label has-text-centered">
					<strong>{label}</strong>
				</p>
				<ul className="menu-list">{children}</ul>
			</div>
		</section>
	);
}

export function MenuItem({ children, to }) {
	return (
		<li>
			<Link className="navbar-item" to={to}>
				{children}
			</Link>
		</li>
	);
}

export function Input({ field, form: { touched, errors }, type, placeholder, size, label, icon, loading, mask }) {
	return (
		<div>
			<div
				className={`control is-${size} ${icon && 'has-icons-left'} has-icons-right ${loading && 'is-loading'}`}
			>
				{!mask ? (
					<input
						type={type}
						placeholder={placeholder}
						className={`input is-${size} is-${touched[field.name] && errors[field.name] && 'danger'}`}
						{...field}
					/>
				) : (
					<InputMask
						placeholder={placeholder}
						className={`input is-${size} is-${touched[field.name] && errors[field.name] && 'danger'}`}
						mask={mask}
						maskChar=" "
						{...field}
					/>
				)}
				{icon && (
					<span className={`icon is-${size} is-left`}>
						<FontAwesomeIcon icon={icon} />
					</span>
				)}

				{touched[field.name] &&
				!errors[field.name] && (
					<span className={`icon is-${size} is-right`}>
						<i className={`fas fa-check`} />
					</span>
				)}

				{touched[field.name] &&
				errors[field.name] && (
					<span className={`icon is-${size} is-right`}>
						<i className={`fas fa-times`} />
					</span>
				)}
			</div>
			{touched[field.name] && errors[field.name] && <p className="help is-danger">{errors[field.name]}</p>}
		</div>
	);
}

export function Tiles({ children }) {
	return <div className="tile is-ancestor">{children}</div>;
}

export function Parent({ children, vertical }) {
	return <div className={`tile is-parent ${!vertical || 'is-vertical'}`}>{children}</div>;
}

export function Tile({ children, color, box }) {
	return (
		<article className={`tile is-child ${!color || 'notification'} is-${color} ${!box || 'box'}`}>
			{children}
		</article>
	);
}

export function Vertical({ children, size }) {
	return <div className={`tile is-vertical is-${size}`}>{children}</div>;
}
