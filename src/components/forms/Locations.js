import React, { useState } from 'react';

import _ from 'lodash';
import { FastField, useFormikContext } from 'formik';

import Map from 'components/ui/Map';
import Places from 'components/ui/Places';

import { Box } from 'components/ui/bulma/elements';
import { Columns, Column } from 'components/ui/bulma/layout';

export default function Locations() {
	const { values: { locations }, setValues } = useFormikContext();
	const [ selected, setSelected ] = useState(locations[0]);

	const addLocation = (location) => {
		if (!_.find(locations, [ 'formatted_address', location.formatted_address ]))
			setValues({ locations: locations.concat(location) });
	};

	const removeLocation = (formatted_address) => {
		setValues({ locations: _.reject(locations, { formatted_address }) });
	};

	return (
		<div>
			<FastField
				name="location"
				label="Add locations, as many as you like"
				icon="search"
				size="large"
				component={Places}
				placeholder="Look up by address or business name"
				action={addLocation}
			/>
			<br />
			<br />
			<Columns>
				<Column>
					<Box>
						<p className="title is-4">Selected locations</p>
						{/* <p className="subtitle">Add as many as you like</p> */}

						{locations.length > 0 ? (
							locations.map((location) => (
								<a key={location.formatted_address} onClick={() => setSelected(location)}>
									<div className="notification">
										<span
											className="delete"
											onClick={() => removeLocation(location.formatted_address)}
										/>
										<p className="title is-6">{location.formatted_address}</p>
									</div>
									<small />
								</a>
							))
						) : (
							<div className="notification">
								{/* <p className="subtitle is-6">No selected locations</p> */}
							</div>
						)}
					</Box>
				</Column>
				<Column>
					<Box>
						<p className="title is-4">Map View</p>
						{/* <p className="subtitle">Toggle full-screen view for larger map</p> */}
						<Map locations={locations} selected={selected} />
					</Box>
				</Column>
			</Columns>
		</div>
	);
}
