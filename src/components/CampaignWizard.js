import React, { useContext, useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import { FastField, useFormikContext } from 'formik';
import { FormikWizard, useFormikWizard } from 'formik-wizard';
import { object, string } from 'yup';

import Places from 'components/ui/Places';

import { Box, Button, ButtonGroup, Progress } from 'components/ui/bulma/elements';
import { Input } from 'components/ui/bulma/form';

import UserContext from 'context/UserContext';

const CREATE_CAMPAIGN = gql`
	mutation CreateCampaign($campaignProps: CampaignProps, $locationProps: [LocationProps], $adProps: [AdProps]) {
		createCampaignWithWizard(campaignProps: $campaignProps, locationProps: $locationProps, adProps: $adProps) {
			id
		}
	}
`;

export default function CampaignWizard({ navigate }) {
	const { headers } = useContext(UserContext);
	const [ spinner, setSpinner ] = useState(false);
	const [ createCampaign, { data, loading, error } ] = useMutation(CREATE_CAMPAIGN, {
		context: { headers }
	});

	const handleSubmit = React.useCallback(
		(values) => {
			setSpinner(true);
			let locationProps = [];

			const { brand: { name, message }, locations: { locations }, rewards: { rate } } = values;

			const campaignProps = {
				name,

				hashtag: name
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

			const adProps = [
				{
					creativeURI: '',
					message,
					rate: rate.toString(),
					currency: 'USD',
					radius: 25,
					status: 'pending'
				}
			];

			createCampaign({ variables: { campaignProps, locationProps, adProps } });

			setSpinner(false);

			navigate('/');
		},
		[createCampaign, navigate]
	);

	return <FormikWizard steps={steps} onSubmit={handleSubmit} render={FormWrapper} />;
}

const WizardProgress = ({ steps, currentStep }) => (
	<nav className="breadcrumb is-medium has-succeeds-separator" aria-label="breadcrumbs">
		<Progress value={(steps.indexOf(currentStep) + 1) / steps.length * 100} color="primary" />
		<ul>
			{steps.map((step) => (
				<li
					key={step}
					className={
						stepProps[steps.indexOf(step)].id === stepProps[steps.indexOf(currentStep)].id ? (
							'is-active'
						) : (
							''
						)
					}
				>
					<a href="#">
						<span className="icon is-small">
							<i className={`fa fa-${stepProps[steps.indexOf(step)].icon}`} aria-hidden="true" />
						</span>
						<span>{`${stepProps[steps.indexOf(step)].name}`}</span>
					</a>
				</li>
			))}
		</ul>
		<hr />

		<h1 className="title">{`${stepProps[steps.indexOf(currentStep)].title}`}</h1>
		<h2 className="subtitle">{stepProps[steps.indexOf(currentStep)].subtitle}</h2>
	</nav>
);

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
		<br />
		<Box>
			<div className="tile is-ancestor">
				<div className="tile is-parent">
					<div className="tile is-child box">
						<WizardProgress steps={steps} currentStep={currentStep} />

						{children}
						{status && (
							<div>
								{status.message}
								<hr />
							</div>
						)}

						<hr />
						<ButtonGroup>
							<Button
								size="medium"
								icon="angle-left"
								color="white"
								action={goToPreviousStep}
								disabled={!canGoBack}
							>
								Back
							</Button>
							<Button type="submit" block size="medium" icon="check-circle">
								{actionLabel || (isLastStep ? 'Finish' : 'Continue')}
							</Button>
						</ButtonGroup>
					</div>
				</div>
			</div>
		</Box>
	</div>
);

function Brand() {
	return (
		<div>
			<FastField
				name="name"
				label="Brand name"
				icon="copyright"
				size="large"
				component={Input}
				placeholder="Example: Super Coffee Place"
			/>
			<br />
			<FastField
				name="message"
				label="Promo message (optional)"
				icon="bullhorn"
				size="large"
				component={Input}
				placeholder="Example: Best coffee in town, guaranteed!"
			/>
		</div>
	);
}

function Locations() {
	const { values, setValues } = useFormikContext();

	const { locations } = values;

	const addLocation = (location) => {
		const newLocations = values.locations.concat(location);
		setValues({ locations: newLocations });
	};

	return (
		<FastField
			name="location"
			label="Find a location or business"
			icon="search"
			size="large"
			component={Places}
			placeholder="Look up an address or a business name"
			action={addLocation}
			locations={locations}
		/>
	);
}
function Rewards() {
	const { errors, touched } = useFormikContext();

	return (
		<FastField
			type="number"
			name="rate"
			label="Reward per post. We suggest to start with $1."
			icon="dollar-sign"
			size="large"
			component={Input}
			placeholder="Reward per post"
		/>
	);
}

function Summary() {
	const { values } = useFormikWizard();
	const { brand: { name, message }, locations: { locations }, rewards: { rate } } = values;

	return (
		<div>
			<p className="title is-4">Brand: {name} </p>
			<p className="subtitle is-5">Promo message: {message ? message : 'Not set'}</p>
			<br />
			<p className="title is-4">Selected Locations:</p>
			<ul className="subtitle is-5">
				{locations.map(({ formatted_address }) => <li key={formatted_address}>{formatted_address}</li>)}
			</ul>
			<br />
			<p className="title is-4">Reward: ${rate} per post </p>
		</div>
	);
}

const steps = [
	{
		id: 'brand',
		component: Brand,
		initialValues: {
			name: '',
			message: ''
		},
		validationSchema: object().shape({
			name: string().required('Please set a campaign name!')
		})
		// actionLabel: 'Next: Choose location'
	},
	{
		id: 'locations',
		component: Locations,
		initialValues: {
			location: '',
			locations: []
		}
		// validationSchema: object().shape({
		// 	locations: array().required('Must have friends').min(3, 'Minimum of 3 friends')
		// })
		// actionLabel: 'Next'
	},
	{
		id: 'rewards',
		component: Rewards,
		initialValues: {
			rate: ''
		},
		validationSchema: object().shape({
			rate: string().required()
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
	{
		id: 'brand',
		icon: 'globe',
		name: 'Your Brand',
		title: 'Your Brand or Product name',
		subtitle: 'Please set a name corresponding to a brand, product or business you are promoting'
	},
	{
		id: 'locations',
		icon: 'map-marker-alt',
		name: 'Choose Locations',
		title: 'Choose your locations',
		subtitle: 'Please use the map seach tool to add as many locations as you want, anywhere in the world.'
	},
	{
		id: 'rewards',
		icon: 'coins',
		name: 'Set Rewards',
		title: 'Set your reward',
		subtitle: 'How much shall you pay for each post?'
	},
	{
		id: 'summary',
		icon: 'clipboard-list',
		name: 'Campaign Summary',
		title: 'Campaign Summary',
		subtitle: 'Please check if all is correct. Feel free to go back and change anything.'
	}
];
