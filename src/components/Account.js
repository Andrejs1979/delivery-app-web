import React, { useContext, useState } from 'react';

import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { Router } from '@reach/router';
import { Formik, Form, Field } from 'formik';
import { ModalProvider } from 'react-modal-hook';
import { useAuthState } from 'react-firebase-hooks/auth';
import { firebaseAppAuth } from 'services/firebase';

import Layout from 'components/ui/Layout';
import { Hero } from 'components/ui/bulma/layout';
import { Box, Button, ButtonGroup } from 'components/ui/bulma/elements';
import { Input } from 'components/ui/bulma/form';

import Dashboard from 'components/pages/Dashboard';
import Campaigns from 'components/pages/Campaigns';
import Consumers from 'components/pages/Consumers';
import Posts from 'components/pages/Posts';
import Locations from 'components/pages/Locations';
import Ads from 'components/pages/Ads';
import Transactions from 'components/pages/Transactions';

import UserContext from 'context/UserContext';

const CURRENT_USER = gql`
	query CurrentUser($email: String) {
		accounts(email: $email) {
			id
			name
			apiKey
			status
			isLive
		}
	}
`;

const ONBOARD_ACCOUNT = gql`
	mutation OnboardAccount($accountProps: AccountProps) {
		onboardAccount(accountProps: $accountProps) {
			id
			type
			name
		}
	}
`;

const UPDATE_USER = gql`
	mutation UpdateUser($userProps: UserProps) {
		updateUser(userProps: $userProps) {
			id
			firstName
			lastName
		}
	}
`;

export default function Account() {
	const [ user ] = useAuthState(firebaseAppAuth);
	const headers = { Authorization: `Bearer ${user.uid}` };
	const { loading, data, error } = useQuery(CURRENT_USER, {
		variables: { email: user.email },
		context: { headers }
	});

	if (loading) return <div>Loading</div>;
	if (error) return <div>{error}</div>;

	const account = data.accounts[0];

	return (
		<UserContext.Provider value={{ user, account, headers }}>
			{account.status === 'new' ? (
				<AccountSetup />
			) : (
				<ModalProvider>
					<Router>
						<Layout path="/">
							<Dashboard path="/" />
							<Campaigns path="/campaigns" />
							<Consumers path="/consumers" />
							<Posts path="/posts" />
							<Locations path="/locations" />
							<Ads path="/ads" />
							<Transactions path="/transactions" />
						</Layout>
					</Router>
				</ModalProvider>
			)}
		</UserContext.Provider>
	);
}

function AccountSetup() {
	const { user, account, headers } = useContext(UserContext);
	const [ type, setType ] = useState();
	const [ onboardAccount ] = useMutation(ONBOARD_ACCOUNT, {
		context: { headers },
		refetchQueries: [ 'CurrentUser' ]
	});
	const [ updateUser ] = useMutation(UPDATE_USER, { context: { headers } });

	return (
		<Hero>
			<div className="columns is-mobile is-centered">
				{!type ? (
					<div className="column">
						<h1 className="title">Select account type</h1>
						{/* <h2 className="subtitle">Step 1. Please choose your account type</h2> */}

						<Box>
							<div className="tile is-ancestor">
								<div className="tile is-parent">
									<div className="tile is-child box">
										<span className="icon is-large">
											<i className="fas fa-3x fa-store" />
										</span>
										<br />
										<br />
										<p className="title">Business Owner</p>
										<p className="subtitle">Simple tools to promote your business</p>
										<Button icon="check-circle" action={() => setType('sme')}>
											Select
										</Button>
									</div>
								</div>
								<div className="tile is-parent">
									<div className="tile is-child box">
										<span className="icon is-large">
											<i className="fas fa-3x fa-user-tie" />
										</span>
										<br />
										<br />
										<p className="title">Marketing Pro</p>
										<p className="subtitle">Multiple campaigns, advanced tools</p>
										<Button icon="check-circle" action={() => setType('brand')}>
											Select
										</Button>
									</div>
								</div>
								<div className="tile is-parent">
									<div className="tile is-child box">
										<span className="icon is-large">
											<i className="fas fa-3x fa-briefcase" />
										</span>
										<br />
										<br />
										<p className="title">Agency</p>
										<p className="subtitle">Manage multiple advertising accounts</p>
										<Button icon="check-circle" action={() => setType('agency')}>
											Select
										</Button>
									</div>
								</div>
							</div>
						</Box>
					</div>
				) : (
					<div className="column is-half">
						<h1 className="title">Tell us about you</h1>
						{/* <h2 className="subtitle">Step 2. A bit about you</h2> */}

						<Box>
							<div className="tile is-ancestor">
								<div className="tile is-parent">
									<div className="tile is-child box">
										<Formik
											initialValues={{
												name: '',
												fullName: '',
												phone: ''
											}}
											validate={validate}
											onSubmit={(values, { setSubmitting, setStatus }) => {
												setSubmitting(true);

												const accountProps = {
													id: account.id,
													name: values.name,
													type
												};

												const [ firstName, lastName ] = values.fullName.split(' ');

												const userProps = {
													uid: user.uid,
													firstName,
													lastName,
													phone: values.phone
												};

												updateUser({ variables: { userProps } });
												onboardAccount({ variables: { accountProps } });
												setSubmitting(false);
											}}
										>
											{({
												status,
												isSubmitting,
												handleSubmit,
												handleChange,
												handleBlur,
												values,
												touched,
												errors
											}) => (
												<Form>
													<Field
														name="name"
														label={
															type === 'owner' ? (
																'Trading As'
															) : type === 'agency' ? (
																'Agency Name'
															) : (
																'Company Name'
															)
														}
														icon={
															type === 'owner' ? (
																'store'
															) : type === 'agency' ? (
																'briefcase'
															) : (
																'building'
															)
														}
														size="large"
														component={Input}
														placeholder={
															type === 'owner' ? (
																'Trading As'
															) : type === 'agency' ? (
																'Agency Name'
															) : (
																'Company Name'
															)
														}
													/>

													<Field
														name="fullName"
														label="Your full name"
														icon="user"
														size="large"
														component={Input}
														placeholder="Full Name"
													/>

													<Field
														name="phone"
														label="Phone Number"
														icon="phone"
														size="large"
														component={Input}
														placeholder="Phone Number"
													/>

													<br />
													<ButtonGroup>
														<Button
															size="medium"
															icon="angle-left"
															color="white"
															action={() => setType()}
														>
															Back
														</Button>
														<Button type="submit" block size="medium" icon="check-circle">
															Finish
														</Button>
													</ButtonGroup>
												</Form>
											)}
										</Formik>
									</div>
								</div>
							</div>
						</Box>
					</div>
				)}
			</div>
		</Hero>
	);
}

const validate = (values) => {
	let errors = {};

	if (!values.name) errors.name = 'Please enter your email!';
	if (!values.fullName) errors.fullName = 'Please enter your full name!';
	if (!values.phone) errors.phone = 'Please enter your phone!';

	return errors;
};
