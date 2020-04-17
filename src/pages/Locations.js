import 'mapbox-gl/dist/mapbox-gl.css';
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';

import React, { useState, useEffect, useRef } from 'react';

import MapGL, { GeolocateControl, Marker } from 'react-map-gl';
import { BaseControl } from 'react-map-gl';
import DeckGL, { GeoJsonLayer } from 'deck.gl';
import Geocoder from 'react-map-gl-geocoder';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Menu from 'components/ui/Menu';
import { Container, Columns, Column, Box, Button } from 'components/ui/bulma';

import OrderForm from 'components/forms/Order';

import logo from 'assets/logo.png';

const token = 'pk.eyJ1IjoiYW5kcmVqczE5NzkiLCJhIjoiY2s4ZXg3M3hxMDBtaDNkbjZwMGl1ZGNkMCJ9.lfRQSV9ls7UYOQgG4zJSSg';

const geolocateStyleMobile = {
	position: 'absolute',
	bottom: '150px',
	right: '12%',
	zIndex: 100
};

const geolocateStyleDesktop = {
	position: 'absolute',
	bottom: '19%',
	right: '40%',
	zIndex: 100
};

export default function Locations({ phone }) {
	const mapRef = useRef();
	const geoCoder = useRef();

	const [ location, setLocation ] = useState();
	const [ order, setOrder ] = useState();
	const [ viewport, setViewport ] = useState({
		latitude: 38.9,
		longitude: -77.02,
		zoom: 12
	});

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

					<Panel geoCoder={geoCoder} order={order} setOrder={setOrder} location={location} phone={phone} />

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
			<nav className="navbar is-fixed-top has-background-light">
				<Columns mobile vertical>
					<Column>
						<FontAwesomeIcon
							icon="bars"
							size="lg"
							color="black"
							onClick={() => setExtended(true)}
							style={{ margin: 20 }}
						/>
					</Column>
					<Column>
						<img src={logo} width="100" className="is-hidden-desktop" />
						<img src={logo} width="200" className="is-hidden-mobile" />
					</Column>
					<Column />
				</Columns>
			</nav>
			<Menu extendedMenu={extended} extendMenu={setExtended} />
		</div>
	);
};
// const NavBar = () => {
// 	const [ extended, setExtended ] = useState(false);
// 	return (
// 		<div>
// 			<nav className="level is-mobile has-background-light box">
// 				<p className="level-item has-text-left">
// 					<span className="fa-layers fa-fw fa-2x" onClick={() => setExtended(true)}>
// 						<FontAwesomeIcon icon="bars" color="black" transform="shrink-6" />
// 					</span>
// 				</p>

// 				<p className="level-item has-text-left">
// 					<img src={logo} width="75" />
// 				</p>

// 				<p className="level-item has-text-centered">
// 					<br />
// 				</p>
// 			</nav>
// 			<Menu extendedMenu={extended} extendMenu={setExtended} />
// 		</div>
// 	);
// };

const Panel = ({ geoCoder, order, location, phone, setOrder }) => (
	<div className="columns is-mobile is-centered">
		<div
			className="column is-11-mobile is-11-touch is-5-tablet is-3-desktop"
			style={{
				// display: 'flex',

				justifyContent: 'center',
				alignItems: 'center',
				position: 'absolute',
				bottom: '15px',
				zIndex: 50
			}}
		>
			{!order ? (
				<div className="box has-background-light" style={{ height: 300 }}>
					<br />
					<br />
					<p className="title is-size-5">Where would you like your art and gift delivered?</p>
					<div
						ref={geoCoder}
						style={{
							alignItems: 'right',
							marginRight: 50
						}}
					/>
					<br />
					<Button block size="medium" color="danger" disabled={!location} action={() => setOrder(true)}>
						Continue
					</Button>
				</div>
			) : (
				<div style={{ height: 350 }}>
					<OrderForm
						location={location}
						address={`${location.address} ${location.text}`}
						phone={phone}
						order={order}
						setOrder={setOrder}
					/>
				</div>
			)}
		</div>
	</div>
);
