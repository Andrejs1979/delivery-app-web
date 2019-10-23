import React, { useCallback, useContext, useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import Overlay from 'react-image-overlay';
import { FastField, useFormikContext } from 'formik';
import { FormikWizard, useFormikWizard } from 'formik-wizard';
import { object, string, array, number, boolean } from 'yup';

import Modal from 'components/ui/Modal';
import Wizard from 'components/ui/Wizard';
import Brand from 'components/forms/Brand';
import Budget from 'components/forms/Budget';
import Locations from 'components/forms/Locations';

import { Box, Button, ButtonGroup } from 'components/ui/bulma/elements';
import { Hero, Columns, Column } from 'components/ui/bulma/layout';

import UserContext from 'context/UserContext';

import example from 'assets/images/example.jpeg';

const CLOUDINARY = process.env.REACT_APP_CLOUDINARY_URI;

export default function CampaignWizard({ onClose }) {
	const { headers } = useContext(UserContext);
	const [ spinner, setSpinner ] = useState(false);
	const [ createCampaign, { data, loading, error } ] = useMutation(CREATE_CAMPAIGN, {
		context: { headers },
		refetchQueries: [ 'CurrentUser' ]
	});

	const handleSubmit = useCallback(
		({
			brand: { name, hashtag, message, creative: { uri, size, aspectRatio, position, background, secureURL } },
			locations: { locations },
			budget: { rate, limit }
		}) => {
			setSpinner(true);
			let locationProps = [];

			const campaignProps = {
				name,
				hashtag,
				limit
			};

			locations.map(
				({ address_components, lat, lng, place_id, types }) =>
					(locationProps = locationProps.concat({
						name: '',
						verified: false,
						active: false,
						category: '',
						status: 'pending',
						address: `${address_components[0].short_name} ${address_components[1].short_name}`,
						city: address_components[2].short_name,
						state: address_components[4].short_name,
						zip: address_components[6].short_name,
						country: address_components[5].long_name,
						geometry: {
							type: 'Point',
							coordinates: [ lng, lat ]
						},
						source: 'google',
						sourceID: place_id
					}))
			);

			const adProps = {
				creativeURI: uri,
				size,
				aspectRatio,
				position,
				background,
				secureURL,
				message,
				rate: rate.toString(),
				currency: 'USD',
				radius: 25,
				status: 'pending'
			};

			createCampaign({ variables: { campaignProps, locationProps, adProps } });

			setSpinner(false);
		},
		[ createCampaign ]
	);

	return (
		// <Modal icon="magic" title="New campaign" onClose={onClose}>
		<Hero color="white" bold>
			<FormikWizard steps={steps} onSubmit={handleSubmit} render={FormWrapper} />
		</Hero>
		// </Modal>
	);
}

function Summary() {
	const { values } = useFormikWizard();
	const [ FRAME_W, FRAME_H ] = [ 400, 400 ];

	const {
		brand: { name, hashtag, message, creative: { uri, size, aspectRatio, position, background } },
		locations: { locations },
		budget: { rate, limit }
	} = values;

	const [ width, height ] = size;

	return (
		<Columns>
			<Column>
				<Box>
					<p className="title is-4">Brand</p>
					<p className="title is-5">{name}</p>
					<p className="subtitle is-5">#{hashtag}</p>
					<p className="subtitle is-5">{message ? message : 'Not set'}</p>
					<hr />
					<p className="title is-4">Locations</p>
					{locations.map((location) => (
						<a key={location.formatted_address}>
							<div className="notification">
								<p className="title is-7">{location.formatted_address}</p>
							</div>
							<small />
						</a>
					))}
					<hr />
					<p className="title is-4">Budget</p>
					<p className="title is-5">${rate} per approved post </p>
					<p className="title is-5">Budget limited at ${limit}</p>
				</Box>
			</Column>
			<Column>
				<Box>
					<p className="title is-4">Preview</p>
					<p className="subtitle">How it may look like on Instagram</p>
					<Overlay
						url={example}
						overlayUrl={`${CLOUDINARY}/c_scale,${!background
							? 'e_bgremoval,'
							: ''}h_${height},w_${width}/creative/${uri}`}
						imageHeight={FRAME_H}
						imageWidth={FRAME_W}
						position={position}
						overlayWidth={width}
						overlayHeight={height}
						overlayPadding={10}
						watermark={false}
					/>
					<br />
					<p className="subtitle is-6">
						This is a preview. We review every campaign and will make sure it looks good before going live.
					</p>
				</Box>
			</Column>
		</Columns>
	);
}

const FormWrapper = ({
	currentStep,
	steps,
	children,
	isLastStep,
	status,
	goToPreviousStep,
	canGoBack,
	actionLabel
}) => (
	<div>
		<Wizard steps={steps} currentStep={currentStep} stepProps={stepProps} />

		{children}
		{status && (
			<div>
				{status.message}
				<hr />
			</div>
		)}

		<hr />
		<ButtonGroup right>
			<Button size="medium" icon="angle-left" color="white" action={goToPreviousStep} disabled={!canGoBack}>
				Back
			</Button>
			<Button type="submit" block size="medium" icon="check-circle">
				{actionLabel || (isLastStep ? 'Launch Campaign' : 'Continue')}
			</Button>
		</ButtonGroup>
	</div>
);

const steps = [
	// {
	// 	id: 'billing',
	// 	component: Billing,
	// 	initialValues: {
	// 		rate: ''
	// 	},
	// 	validationSchema: object().shape({
	// 		rate: string().required()
	// 	})
	// 	// actionLabel: 'Next',
	// },

	{
		id: 'brand',
		component: Brand,
		icon: 'ad',
		name: 'Brand',
		title: 'Your brand',
		subtitle: 'Please set a name corresponding to a brand, product or business you are promoting',
		initialValues: {
			name: '',
			hashtag: '',
			message: '',
			creative: {}
		},
		validationSchema: object().shape({
			name: string().required('What is it we promote?'),
			hashtag: string().required('Hashtag is required!').min(5, 'Too short').max(10, 'Too long'),
			message: string(),
			creative: object({
				uri: string().required('Please upload your file!'),
				size: array().required('Size'),
				aspectRatio: number().required('Ratio'),
				position: string().required('position'),
				background: boolean().required('background')
			}).required('Please upload your graphics!')
		})
		// actionLabel: 'Next: Choose location'
	},
	{
		id: 'locations',
		component: Locations,
		initialValues: {
			location: '',
			locations: []
		},
		validationSchema: object().shape({
			locations: array().required('Please add some locations').min(1, 'Min. 1 location required')
		})
		// actionLabel: 'Next'
	},
	{
		id: 'budget',
		component: Budget,
		initialValues: {
			rate: '',
			limit: ''
		},
		validationSchema: object().shape({
			rate: number().required().min(1).max(100),
			limit: number().min(1).max(10000)
		}),
		// actionLabel: 'Next',
		onAction: (sectionValues, formValues) => {
			if (sectionValues.companyName === 'argh!') {
				throw new Error('Please, choose a better name!');
			}
		}
	},

	{
		id: 'summary',
		component: Summary
	}
];

const stepProps = [
	// {
	// 	id: 'billing',
	// 	icon: 'coins',
	// 	name: 'Billing',
	// 	title: 'Billing',
	// 	subtitle: 'How much shall you pay for each post?'
	// },
	{
		id: 'brand',
		icon: 'ad',
		name: 'Brand',
		title: 'Your brand',
		subtitle: 'Marketing assets in relation to a brand, product or business you are promoting'
	},

	{
		id: 'locations',
		icon: 'map-marker-alt',
		name: 'Locations',
		title: 'Choose your locations',
		subtitle: 'Please use the map seach tool to add as many locations as you want, anywhere in the world.'
	},
	{
		id: 'budget',
		icon: 'coins',
		name: 'Budget',
		title: 'Set your reward',
		subtitle: 'How much shall you pay for each post?'
	},

	{
		id: 'summary',
		icon: 'clipboard-list',
		name: 'Summary',
		title: 'Campaign Summary',
		subtitle: 'Please check if all is correct. Feel free to go back and change anything.'
	}
];

const CREATE_CAMPAIGN = gql`
	mutation CreateCampaign($campaignProps: CampaignProps, $locationProps: [LocationProps], $adProps: [AdProps]) {
		createCampaignWithWizard(campaignProps: $campaignProps, locationProps: $locationProps, adProps: $adProps) {
			id
		}
	}
`;
