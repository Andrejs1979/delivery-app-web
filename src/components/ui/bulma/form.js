import React from 'react';

export function Input({ field, form: { touched, errors }, ...props }) {
	return (
		<div className="field">
			<label className="label is-large">{props.label}</label>
			<div className="control has-icons-left has-icons-right">
				<input className="input is-large" {...field} {...props} />
				<span className="icon is-large is-left">
					<i className="fas fa-user" />
				</span>
				{/* <span className="icon is-small is-right">
					<i className="fas fa-check" />
				</span> */}
			</div>
			<p className="help is-danger">{field.error}</p>
		</div>
	);
}
