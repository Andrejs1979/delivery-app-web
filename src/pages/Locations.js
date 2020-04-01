import React, { useContext, useState } from 'react';
import _ from 'lodash';
import { gql, useQuery } from '@apollo/client';
import { FastField, Formik } from 'formik';
// import Map from 'components/ui/Map';
// import Places from 'components/ui/Places';

import MapLocations from 'components/forms/Locations';

import Cards from 'components/ui/Cards';
import Error from 'components/ui/Error';
import Spinner from 'components/ui/Spinner';
import { Container, Hero, Box, Columns, Column, Section } from 'components/ui/bulma';

export default function Locations() {
	const [ location, setLocation ] = useState();

	return <MapLocations />;
}

// { "campaignID": "5cdb2c9f6ac4730411eb29ba" }

const LOCATIONS = gql`
	query Locations($campaignID: ID) {
		locations(campaignID: $campaignID) {
			id
			name
			category
			address
			city
			state
			zip
			country
			active
			verified
			campaigns {
				id
			}
			assets {
				id
				logoURI
				defaultPictureURI
			}
		}
	}
`;
