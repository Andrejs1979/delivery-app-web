import React from 'react';

export function Input({ field, form: { touched, errors }, type, size, label, icon, placeholder, help, loading }) {
	return (
		<div className="field">
			<label className={`label is-hidden-mobile is-${size}`}>{label}</label>
			<label className={`label is-hidden-desktop`}>{label}</label>
			<div
				className={`control is-${size} ${icon && 'has-icons-left'} has-icons-right ${loading && 'is-loading'}`}
			>
				<input
					type={type}
					placeholder={placeholder}
					className={`input is-hidden-mobile is-${size} is-${touched[field.name] &&
						errors[field.name] &&
						'danger'}`}
					aria-haspopup="true"
					aria-controls="suggestions"
					{...field}
				/>
				<input
					type={type}
					placeholder={placeholder}
					className={`input is-hidden-desktop is-${touched[field.name] && errors[field.name] && 'danger'}`}
					aria-haspopup="true"
					aria-controls="suggestions"
					{...field}
				/>

				{icon && (
					<span className={`icon is-hidden-mobile is-${size} is-left`}>
						<i className={`fas fa-${icon}`} />
					</span>
				)}

				{touched[field.name] && (
					<span className={`icon is-hidden-mobile is-${size} is-right`}>
						{errors[field.name] ? <i className={`fas fa-times`} /> : <i className={`fas fa-check`} />}
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
