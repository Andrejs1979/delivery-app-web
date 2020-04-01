import 'mapbox-gl/dist/mapbox-gl.css';
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';

import React, { useState, useRef } from 'react';

import MapGL, { GeolocateControl } from 'react-map-gl';
import DeckGL, { GeoJsonLayer } from 'deck.gl';
import Geocoder from 'react-map-gl-geocoder';

import Navbar from 'components/ui/Navbar';
import { Box } from 'components/ui/bulma';

const token = 'pk.eyJ1IjoiYW5kcmVqczE5NzkiLCJhIjoiY2s4ZXg3M3hxMDBtaDNkbjZwMGl1ZGNkMCJ9.lfRQSV9ls7UYOQgG4zJSSg';

const geolocateStyle = {
	float: 'right',
	margin: '10px',
	padding: '10px'
};

export default function SearchableMap() {
	const mapRef = useRef();
	const [ location, setLocation ] = useState();
	const [ viewport, setViewport ] = useState({
		latitude: 38.9,
		longitude: -77.02,
		zoom: 12
	});

	const [ searchResultLayer, setSearchResultLayer ] = useState(null);

	const handleOnResult = (event) => {
		setLocation(event.result);
		setSearchResultLayer(
			new GeoJsonLayer({
				id: 'search-result',
				data: event.result.geometry,
				getFillColor: [ 0, 0, 0, 255 ],
				getRadius: 1000,
				pointRadiusMinPixels: 10,
				pointRadiusMaxPixels: 10
			})
		);
	};

	const handleGeocoderViewportChange = (viewport) => {
		const geocoderDefaultOverrides = { transitionDuration: 1000 };

		return handleViewportChange({
			...viewport,
			...geocoderDefaultOverrides
		});
	};

	const handleViewportChange = (viewport) => {
		setViewport({ ...viewport });
	};

	const _onViewportChange = (viewport) => setViewport({ ...viewport, transitionDuration: 3000 });

	return (
		<div style={{ height: '100vh' }}>
			<Navbar location={location} />
			<MapGL
				ref={mapRef}
				{...viewport}
				// mapStyle="mapbox://styles/andrejs1979/ck8gin8zl09us1ioih7tkmcpi"
				width="100%"
				height="80%"
				onViewportChange={_onViewportChange}
				mapboxApiAccessToken={token}
			>
				<GeolocateControl
					style={geolocateStyle}
					positionOptions={{ enableHighAccuracy: true }}
					trackUserLocation={true}
				/>
				<Geocoder
					mapRef={mapRef}
					onResult={handleOnResult}
					onViewportChange={handleGeocoderViewportChange}
					mapboxApiAccessToken={token}
					position="top-left"
				/>
			</MapGL>
			{/* <DeckGL {...viewport} layers={[ searchResultLayer ]} /> */}
		</div>
	);
}

// export default function Locations() {
// 	const [ locations, setLocations ] = useState([]);
// 	const [ result, setResult ] = useState();

// 	const addLocation = (location) => {
// 		if (!_.find(locations, [ 'formatted_address', location.formatted_address ]))
// 			setLocations({ locations: locations.concat(location) });
// 	};

// 	const removeLocation = (formatted_address) => {
// 		setLocations({ locations: _.reject(locations, { formatted_address }) });
// 	};

// 	const [ viewport, setViewPort ] = useState({
// 		width: '100%',
// 		height: '100%',
// 		latitude: 38.9,
// 		longitude: -77.02,
// 		zoom: 12
// 	});

// 	const geolocateStyle = {
// 		float: 'left',
// 		margin: '50px',
// 		padding: '10px'
// 	};

// 	const _onViewportChange = (viewport) => setViewPort({ ...viewport, transitionDuration: 500 });
// 	const mapRef = useRef();

// 	// if you are happy with Geocoder default settings, you can just use handleViewportChange directly
// 	const handleGeocoderViewportChange = (viewport) => {
// 		const geocoderDefaultOverrides = { transitionDuration: 1000 };

// 		return _onViewportChange({
// 			...viewport,
// 			...geocoderDefaultOverrides
// 		});
// 	};

// 	const handleOnResult = (event) => {
// 		setResult({
// 			searchResultLayer: new GeoJsonLayer({
// 				id: 'search-result',
// 				data: event.result.geometry,
// 				getFillColor: [ 255, 0, 0, 128 ],
// 				getRadius: 1000,
// 				pointRadiusMinPixels: 10,
// 				pointRadiusMaxPixels: 10
// 			})
// 		});
// 	};

// 	return (
// 		<div>
// 			<Formik
// 				initialValues={{ location: '' }}
// 				onSubmit={(values, { setSubmitting }) => {
// 					setTimeout(() => {
// 						alert(JSON.stringify(values, null, 2));
// 						setSubmitting(false);
// 					}, 400);
// 				}}
// 			>
// 				{({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
// 					<Form>
// 						<Box>
// 							<div className="field is-horizontal">
// 								<div className="field-body">
// 									<FastField
// 										name="location"
// 										icon="search"
// 										component={Places}
// 										placeholder="Look up by address or business name"
// 										action={addLocation}
// 									/>
// 								</div>
// 							</div>
// 						</Box>
// 					</Form>
// 				)}
// 			</Formik>
// 			<div style={{ height: '85vh' }}>
// 				<MapGL
// 					mapboxApiAccessToken={MAPBOX_KEY}
// 					{...viewport}
// 					onViewportChange={_onViewportChange}
// 					// mapStyle="mapbox://styles/mapbox/streets-v9"
// 				>
// 					<GeolocateControl
// 						style={geolocateStyle}
// 						positionOptions={{ enableHighAccuracy: true }}
// 						trackUserLocation={true}
// 					/>
// 					<Geocoder
// 						mapRef={mapRef}
// 						onResult={handleOnResult}
// 						onViewportChange={handleGeocoderViewportChange}
// 						mapboxApiAccessToken={MAPBOX_KEY}
// 						position="top-left"
// 					/>
// 				</MapGL>
// 				<DeckGL {...viewport} layers={[ result ]} />
// 			</div>

// 			{/* <Box>
// 				{locations.map((location) => (
// 					<a key={location.formatted_address} onClick={() => setSelected(location)}>
// 						<div className="notification">
// 							<span className="delete" onClick={() => removeLocation(location.formatted_address)} />
// 							<p className="title is-6">{location.formatted_address}</p>
// 						</div>
// 						<small />
// 					</a>
// 				))}
// 			</Box> */}

// 			{/* <Box>
// 				<Map locations={locations} selected={selected} />
// 			</Box> */}
// 		</div>
// 	);
// }
