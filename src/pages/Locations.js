import 'mapbox-gl/dist/mapbox-gl.css';
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';

import React, { useState, useEffect, useRef } from 'react';
import { useModal } from 'react-modal-hook';
import MapGL, { GeolocateControl, Marker } from 'react-map-gl';
import { BaseControl } from 'react-map-gl';
import DeckGL, { GeoJsonLayer } from 'deck.gl';
import Geocoder from 'react-map-gl-geocoder';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Menu from 'components/ui/Menu';
import { Container, Box, Button } from 'components/ui/bulma';

import OrderForm from 'components/forms/Order';

import logo from 'assets/logo.png';

const token = 'pk.eyJ1IjoiYW5kcmVqczE5NzkiLCJhIjoiY2s4ZXg3M3hxMDBtaDNkbjZwMGl1ZGNkMCJ9.lfRQSV9ls7UYOQgG4zJSSg';

const geolocateStyleMobile = {
	position: 'absolute',
	bottom: '23%',
	right: '17%',
	zIndex: 100
};

const geolocateStyleDesktop = {
	position: 'absolute',
	bottom: '22%',
	right: '42%',
	zIndex: 100
};

export default function Locations() {
	const mapRef = useRef();
	const geoCoder = useRef();

	const [ location, setLocation ] = useState();
	const [ order, setOrder ] = useState();
	const [ viewport, setViewport ] = useState({
		latitude: 38.9,
		longitude: -77.02,
		zoom: 12
	});

	// const [ showOrderForm, hideOrderForm ] = useModal(
	// 	() => (
	// 		<div className="modal is-active">
	// 			<div className="modal-background" />
	// 			<div className="modal-content">
	// 				<OrderForm address={`${location.address} ${location.text}`} onClose={hideOrderForm} />
	// 			</div>
	// 		</div>
	// 	),
	// 	[ location ]
	// );

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

	const _onViewportChange = (viewport) => setViewport({ ...viewport });

	const geoFilter = (item) =>
		item &&
		item.context &&
		item.context
			.map((i) => i.id.split('.').shift() === 'region' && i.text === 'District of Columbia')
			.reduce((acc, cur) => acc || cur);

	const handleOnResult = ({ result }) => {
		setLocation(result);
	};

	return (
		<div className="has-text-centered">
			<div style={{ height: '100vh' }}>
				<MapGL
					ref={mapRef}
					{...viewport}
					mapStyle="mapbox://styles/andrejs1979/ck8gin8zl09us1ioih7tkmcpi"
					width="100%"
					height="100%"
					onViewportChange={_onViewportChange}
					mapboxApiAccessToken={token}
				>
					<NavBar />
					{!location &&
					!order && (
						<div className="is-hidden-desktop is-hidden-tablet">
							<GeolocateControl
								style={geolocateStyleMobile}
								positionOptions={{ enableHighAccuracy: true }}
								trackUserLocation={true}
							/>
						</div>
					)}
					{!location &&
					!order && (
						<div className="is-hidden-mobile">
							<GeolocateControl
								style={geolocateStyleDesktop}
								positionOptions={{ enableHighAccuracy: true }}
								trackUserLocation={true}
							/>
						</div>
					)}
					<Panel geoCoder={geoCoder} order={order} setOrder={setOrder} location={location} />

					{order || (
						<Geocoder
							mapRef={mapRef}
							containerRef={geoCoder}
							onResult={handleOnResult}
							onViewportChange={handleGeocoderViewportChange}
							mapboxApiAccessToken={token}
							countries="us"
							filter={geoFilter}
						/>
					)}

					{!order &&
					location && (
						<Marker latitude={location.center[1]} longitude={location.center[0]}>
							<FontAwesomeIcon icon="map-marker-alt" size="2x" color="#FF3366" />
						</Marker>
					)}
				</MapGL>
			</div>
		</div>
	);
}

const NavBar = () => {
	const [ extended, setExtended ] = useState(false);
	return (
		<div>
			<Menu extendedMenu={extended} extendMenu={setExtended} />
			<nav className="level is-mobile">
				<p className="level-item has-text-left">
					<span className="fa-layers fa-fw fa-3x" onClick={() => setExtended(true)}>
						<FontAwesomeIcon icon="square" color="white" />
						<FontAwesomeIcon icon="bars" color="black" transform="shrink-6" />
					</span>
				</p>

				<p className="level-item has-text-left">
					<img src={logo} width="120" />
				</p>

				<p className="level-item has-text-centered">
					<br />
				</p>
			</nav>
		</div>
	);
};

const Panel = ({ geoCoder, order, location, setOrder }) => (
	<div
		style={{
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			position: 'absolute',
			bottom: '10%',
			width: '100%'
		}}
	>
		<div className="box has-background-light">
			{!order ? (
				<div>
					<p className="title is-size-4">Look up your address</p>
					<div
						ref={geoCoder}
						style={{
							alignItems: 'center'
						}}
					/>
					<br />
					<Button block size="medium" color="danger" disabled={!location} action={() => setOrder(true)}>
						Continue
					</Button>
				</div>
			) : (
				<OrderForm address={`${location.address} ${location.text}`} />
			)}
		</div>
	</div>
);
