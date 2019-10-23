import React from 'react';

import GoogleMapReact from 'google-map-react';

const KEY = process.env.REACT_APP_GOOGLE_MAPS_KEY;

export default function Map({ locations, selected }) {
	if (locations.length < 1)
		return <div className="notification">{/* <p className="subtitle is-6">No selected locations</p> */}</div>;

	return (
		<div style={{ height: '25vh', width: '100%' }}>
			{locations.length > 0 && (
				<GoogleMapReact
					bootstrapURLKeys={{
						key: KEY
					}}
					center={
						selected ? (
							{ lat: selected.lat, lng: selected.lng }
						) : (
							{ lat: locations[0].lat, lng: locations[0].lng }
						)
					}
					zoom={15}
				>
					{locations.map((location) => (
						<span
							className="icon is-large"
							key={location.formatted_address}
							lat={location.lat}
							lng={location.lng}
						>
							<span className="fa-stack fa-lg">
								<i className="fas fa-circle fa-stack-2x has-text-primary" />
								<i className="fas fa-map-marker-alt fa-stack-1x fa-inverse" />
							</span>
						</span>
					))}
				</GoogleMapReact>
			)}
		</div>
	);
}
