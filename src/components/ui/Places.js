import React from 'react';
import useScript from '@charlietango/use-script';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

const GOOGLE_MAPS_URI = `https://maps.googleapis.com/maps/api/js?key=${process.env
	.REACT_APP_GOOGLE_MAPS_KEY}&libraries=places`;

const handleChange = ({ name, form, search }) => {
	form.setFieldValue(name, search);
};

const onError = (status, clearSuggestions) => {
	console.log('Google Maps API returned error with status: ', status);
	clearSuggestions();
};

export default function Places({ action, field, form, icon, label, placeholder, size }) {
	const [ ready ] = useScript(GOOGLE_MAPS_URI);

	if (ready)
		return (
			<PlacesAutocomplete
				{...field}
				highlightFirstSuggestion={true}
				// shouldFetchSuggestions={field.value.length > 3}
				onChange={(search) => {
					handleChange({ name: field.name, form, search });
				}}
				onSelect={async (search) => {
					handleChange({ name: field.name, form, search: '' });
					try {
						const [ location ] = await geocodeByAddress(search);
						const geo = await getLatLng(location);
						action({ ...location, ...geo });
					} catch (error) {
						console.log(error);
					}
				}}
				onError={onError}
			>
				{({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
					<div className={`dropdown ${suggestions.length > 0 && 'is-active'}`}>
						<div className="dropdown-trigger">
							{/* TODO: Input Component */}
							<div className="field">
								<label className={`label is-${size}`}>{label}</label>
								<div
									className={`control is-${size} ${icon &&
										'has-icons-left'} has-icons-right ${loading && 'is-loading'}`}
								>
									<input
										aria-haspopup="true"
										aria-controls="suggestions"
										placeholder={placeholder}
										className={`input is-${size}`}
										{...getInputProps({
											field,
											form,
											icon,
											label,
											placeholder,
											size
										})}
									/>

									{icon && (
										<span className={`icon is-${size} is-left`}>
											<i className={`fas fa-${icon}`} />
										</span>
									)}
								</div>
							</div>
							{/* TODO END */}
						</div>
						<div className="dropdown-menu" id="suggestions" role="menu">
							<div className="dropdown-content">
								{suggestions.map((suggestion) => (
									<div className="dropdown-item" {...getSuggestionItemProps(suggestion)}>
										<a className="dropdown-item">
											<p className="is-size-4 has-text-weight-bold">
												{suggestion.formattedSuggestion.mainText}
											</p>
											<p className="is-size-5">{suggestion.formattedSuggestion.secondaryText}</p>
										</a>
									</div>
								))}
							</div>
						</div>
					</div>
				)}
			</PlacesAutocomplete>
		);

	return null;
}
