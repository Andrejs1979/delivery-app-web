import React from 'react';

import GoogleMapReact from 'google-map-react';

const KEY = process.env.REACT_APP_GOOGLE_MAPS_KEY;

export default function Map({ children, locations, selected }) {
	return (
		<div style={{ height: '77vh', width: '100%' }}>
			<GoogleMapReact
				bootstrapURLKeys={{
					key: KEY
				}}
				center={{
					lat: 38.9,
					lng: -77.02
				}}
				zoom={12}
			>
				{/* {locations &&
					locations.length > 0 &&
					locations.map((location) => (
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
					))} */}
				<div>{children}</div>
			</GoogleMapReact>
		</div>
	);
}
