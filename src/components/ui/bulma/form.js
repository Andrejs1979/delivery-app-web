import React from 'react';

export function Input({ field, form: { touched, errors }, type, size, label, icon, placeholder, help, loading }) {
	return (
		<div className="field">
			<label className={`label is-${size}`}>{label}</label>
			<div
				className={`control is-${size} ${icon && 'has-icons-left'} has-icons-right ${loading && 'is-loading'}`}
			>
				<input
					type={type}
					placeholder={placeholder}
					className={`input is-${size} is-${touched[field.name] && errors[field.name] && 'danger'}`}
					aria-haspopup="true"
					aria-controls="suggestions"
					{...field}
				/>

				{icon && (
					<span className={`icon is-${size} is-left`}>
						<i className={`fas fa-${icon}`} />
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

			{touched[field.name] && errors[field.name] ? (
				<p className="help is-danger">{errors[field.name]}</p>
			) : (
				<p className="help">{help}</p>
			)}
		</div>
	);
}
