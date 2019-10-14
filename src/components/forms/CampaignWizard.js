import React, { useCallback, useContext, useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import axios from 'axios';

import { useDropzone } from 'react-dropzone';
import Overlay from 'react-image-overlay';

import { FastField, useFormikContext } from 'formik';
import { FormikWizard, useFormikWizard } from 'formik-wizard';
import { object, string } from 'yup';

import Modal from 'components/ui/Modal';
import Places from 'components/ui/Places';

import { Box, Button, ButtonGroup, Progress } from 'components/ui/bulma/elements';
import { Columns, Column } from 'components/ui/bulma/layout';
import { Input } from 'components/ui/bulma/form';

import example from 'assets/images/example.jpeg';

import UserContext from 'context/UserContext';

const CLOUDINARY = process.env.REACT_APP_CLOUDINARY_URI;
const CLOUDINARY_UPLOAD = process.env.REACT_APP_CLOUDINARY_UPLOAD_URI;

export default function CampaignWizard({ navigate, onClose }) {
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
		[ createCampaign, navigate ]
	);

	return (
		<Modal icon="magic" title="New campaign" onClose={onClose}>
			<FormikWizard steps={steps} onSubmit={handleSubmit} render={FormWrapper} />
		</Modal>
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
		<WizardProgress steps={steps} currentStep={currentStep} />
		<h1 className="title">{`${stepProps[steps.indexOf(currentStep)].title}`}</h1>
		<h2 className="subtitle">{stepProps[steps.indexOf(currentStep)].subtitle}</h2>
		<hr />
		{children}
		{status && (
			<div>
				{status.message}
				<hr />
			</div>
		)}

		<hr />
		<ButtonGroup>
			<Button size="medium" icon="angle-left" color="white" action={goToPreviousStep} disabled={!canGoBack}>
				Back
			</Button>
			<Button type="submit" block size="medium" icon="check-circle">
				{actionLabel || (isLastStep ? 'Finish' : 'Continue')}
			</Button>
		</ButtonGroup>
	</div>
);

function Brand() {
	const [ uploadProgress, setUploadProgress ] = useState(0);
	const [ selectedFile, setSelectedFile ] = useState();
	const [ creative, setCreative ] = useState('ihop-breakfast.png');

	const onDrop = useCallback((acceptedFiles) => {
		setSelectedFile(acceptedFiles[0].name);

		const fd = new FormData();
		fd.append('upload_preset', 'creative');
		fd.append('tags', [ 'browser_upload', 'creative' ]);
		fd.append('file', acceptedFiles[0]);

		const config = {
			headers: { 'X-Requested-With': 'XMLHttpRequest' },
			onUploadProgress: (progressEvent) => {
				const progress = Math.round(progressEvent.loaded * 100.0 / progressEvent.total);
				setUploadProgress(progress);
			}
		};
		axios
			.post(CLOUDINARY_UPLOAD, fd, config)
			.then(({ data }) => {
				console.log('res', data);
				const { url, public_id, height, width, format } = data;
				const uri = public_id.split('/');
				console.log(uri);

				setCreative(uri[1]);
			})
			.catch(function(err) {
				console.error('err', err);
			});
	}, []);
	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

	return (
		<Columns>
			<Column>
				<Box>
					<FastField
						name="name"
						label="Business, brand or product"
						icon="copyright"
						size="large"
						component={Input}
						placeholder="Super Coffee Place"
					/>
					<br />
					<FastField
						name="message"
						label="Promo message (optional)"
						icon="bullhorn"
						size="large"
						component={Input}
						placeholder="Best coffee in town!"
					/>
					<br />
					<p className="title is-4">Upload a logo</p>

					<div className="file is-medium has-name is-boxed" {...getRootProps()}>
						<label className="file-label">
							<input className="file-input" type="file" name="resume" {...getInputProps()} />
							<span className="file-cta">
								<span className="file-icon">
									<i className="fas fa-upload" />
								</span>
								<span className="file-label">
									<strong>
										{selectedFile ? (
											selectedFile
										) : isDragActive ? (
											<p>Drop the files here ...</p>
										) : (
											<p>Drop a logo file or click to select</p>
										)}
										{selectedFile &&
										uploadProgress && (
											<Progress value={uploadProgress} color="primary" size="small" />
										)}
									</strong>
								</span>
							</span>
						</label>
					</div>
					<br />
					<p className="subtitle is-6">
						We recommend using a PNG file with a transparent background. If you need help, let us know!
					</p>
				</Box>
			</Column>
			<Column>
				<Box>
					<p className="title is-4">Example</p>
					<p className="subtitle">How it may look like on Instagram</p>
					{console.log(`${CLOUDINARY}/creative/${creative}`)}
					<Overlay
						url={example}
						overlayUrl={`${CLOUDINARY}/creative/${creative}`}
						imageHeight={420}
						imageWidth={420}
						position={'bottomLeft'}
						overlayWidth={200}
						overlayHeight={100}
						overlayPadding={10}
						watermark={false}
					/>
				</Box>
			</Column>
		</Columns>
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

const WizardProgress = ({ steps, currentStep }) => (
	<nav className="breadcrumb has-succeeds-separator" aria-label="breadcrumbs">
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
		<br />
		<Progress value={(steps.indexOf(currentStep) + 1) / steps.length * 100} color="light" size="small" />
	</nav>
);

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
		icon: 'ad',
		name: 'Brand',
		title: 'Your brand',
		subtitle: 'Please set a name corresponding to a brand, product or business you are promoting'
	},

	{
		id: 'locations',
		icon: 'map-marker-alt',
		name: 'Locations',
		title: 'Choose your locations',
		subtitle: 'Please use the map seach tool to add as many locations as you want, anywhere in the world.'
	},
	{
		id: 'rewards',
		icon: 'coins',
		name: 'Rewards',
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
