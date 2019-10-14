import React, { useContext, useState } from 'react';
// import gql from 'graphql-tag';
// import { useQuery, useMutation } from '@apollo/react-hooks';

import { FastField, FieldArray, useFormikContext } from 'formik';
import { FormikWizard, useFormikWizard } from 'formik-wizard';
import { object, string } from 'yup';

import Places from 'components/ui/Places';

import { Hero } from 'components/ui/bulma/layout';
import { Box, Button, ButtonGroup, Icon, Progress } from 'components/ui/bulma/elements';
import { Input } from 'components/ui/bulma/form';

import UserContext from 'context/UserContext';

export default function AccountSetup() {
	// const { headers } = useContext(UserContext);
	const [ welcome, setWelcome ] = useState(false);

	const handleSubmit = React.useCallback((values) => {
		console.log('full values:', values);

		return {
			message: 'Thanks for submitting!'
		};
	}, []);

	return (
		<Hero>
			<div className="columns is-mobile is-centered">
				{welcome ? (
					<div className="column">
						<h1 className="title">Create your first campaign</h1>
						<h2 className="subtitle">We'll walk you through the steps to do it</h2>
						<Box>
							<div className="tile is-ancestor">
								<div className="tile is-parent">
									<div className="tile is-child box">
										<Welcome />
										<hr />
										<Button size="medium" icon="check-circle" action={() => setWelcome(false)}>
											Get started
										</Button>
									</div>
								</div>
							</div>
						</Box>
					</div>
				) : (
					<div className="column">
						<FormikWizard steps={steps} onSubmit={handleSubmit} render={FormWrapper} />
					</div>
				)}
			</div>
		</Hero>
	);
}

const stepTitles = [
	{
		title: 'Brand or product name',
		subtitle: 'Please set a name corresponding to a brand, product or business you are promoting'
	},
	{
		title: 'Name your campaign',
		subtitle: 'Please set a name corresponding to a brand, product or business you are promoting'
	},
	{
		title: 'Name your campaign',
		subtitle: 'Please set a name corresponding to a brand, product or business you are promoting'
	},
	{
		title: 'Set Rewards',
		subtitle: 'Please set a name corresponding to a brand, product or business you are promoting'
	}
];

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
		<h1 className="title">{`Step ${steps.indexOf(currentStep) + 1}. ${stepTitles[steps.indexOf(currentStep)]
			.title}`}</h1>
		<h2 className="subtitle">{stepTitles[steps.indexOf(currentStep)].subtitle}</h2>

		<Progress value={(steps.indexOf(currentStep) + 1) / steps.length * 100} color="primary" />
		<Box>
			<div className="tile is-ancestor">
				<div className="tile is-parent">
					<div className="tile is-child box">
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
								{actionLabel || (isLastStep ? 'Submit' : 'Continue')}
							</Button>
						</ButtonGroup>
					</div>
				</div>
			</div>
		</Box>
	</div>
);

const Welcome = () => (
	<div>
		<span className="icon is-large">
			<i className="fas fa-3x fa-store" />
		</span>
		<br />
		<br />
		<p className="title">Create your first campaign</p>
		<p className="subtitle">We'll walk you through the necessary steps</p>
		<div className="content">
			<ol type="1">
				<li>Brand</li>
				<li>Locations</li>
				<li>Reward</li>
			</ol>
		</div>
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
				label="Marketing Message (optional)"
				icon="comment-dots"
				size="large"
				component={Input}
				placeholder="Example: Best coffee in town, guaranteed!"
			/>
		</div>
	);
}

function Locations() {
	const { values, setValues } = useFormikContext();
	// const [ locations, setLocations ] = useState([]);

	const { locations } = values;

	const addLocation = (location) => {
		console.log('locations:', values.locations);
		const lll = values.locations.concat(location);
		console.log(lll);

		setValues({ locations: lll });
		// setLocations(locations.concat(location));
	};

	return (
		<FastField
			name="location"
			label="Find a location or business"
			icon="search"
			size="large"
			component={Places}
			placeholder="Look up address or place name"
			action={addLocation}
			locations={locations}
		/>
	);
}
function Rewards() {
	const { errors, touched } = useFormikContext();

	return (
		<FastField name="name" label="Brand name" icon="user" size="large" component={Input} placeholder="Brand name" />
	);
}

function Summary() {
	const { values } = useFormikWizard();

	return (
		<div>
			<h1>Is this information correct?</h1>
			<p>User name: {values.personal.userName}</p>
			<p>Company name: {values.company.companyName}</p>
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
		id: 'location',
		component: Locations,
		initialValues: {
			location: '',
			locations: []
		},
		validationSchema: object().shape({
			location: string().required()
		})
		// actionLabel: 'Next'
	},
	{
		id: 'reward',
		component: Brand,
		initialValues: {
			companyName: ''
		},
		validationSchema: object().shape({
			companyName: string().required()
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
