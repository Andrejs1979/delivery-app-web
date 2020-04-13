import React, { useEffect, useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';

import { Columns, Container } from 'components/ui/bulma';
import { Button, Box, Input } from 'components/ui/bulma';

import Timer from 'react-compound-timer';
import { FastField, Formik, Form } from 'formik';
import { object, string } from 'yup';

import { useAuthState } from 'react-firebase-hooks/auth';
import { firebaseAppAuth } from 'services/firebase';

import logo from 'assets/logo.png';

export default function Welcome({ code, setCode }) {
	const [ sent, setSent ] = useState();
	const [ sendCode ] = useMutation(SEND_CODE);
	const [ validateCode ] = useMutation(VALIDATE_CODE);

	return (
		<Box>
			<section className="hero is-info is-fullheight-with-navbar box">
				<div className="hero-body">
					<Container>
						<Columns centered>
							<div className="column is-two-thirds-desktop is-full-mobile has-text-centered">
								{!sent ? (
									<div>
										{/* <div style={{ alignSelf: 'center', alignContent: 'center', width: '200px' }}>
											<img src={logo} alt="Cloud9" />
										</div>

										<br />
										<br /> */}
										<p className="title has-text-centered">Please enter your phone number</p>
										<Formik
											initialValues={{ phone: '' }}
											// validate={validationSchema}
											onSubmit={async ({ phone }, { setSubmitting }) => {
												setSent(true);
												await sendCode({ variables: { phone } });
											}}
										>
											{({ errors, values, isSubmitting }) => (
												<Form>
													<div className="field has-addons has-addons-centered is-hidden-mobile">
														<FastField
															name="phone"
															icon="mobile-alt"
															size="large"
															component={Input}
															mask="999-999-9999"
															placeholder="Phone number"
														/>

														<div className="control">
															<button
																type="submit"
																className="button is-danger is-full is-large"
															>
																Get the code
															</button>
														</div>
													</div>
													<div className="field is-hidden-desktop is-hidden-tablet">
														<FastField
															name="phone"
															icon="mobile-alt"
															size="large"
															component={Input}
															mask="999-999-9999"
															placeholder="Phone number"
														/>
														<br />
														<div className="control">
															<button
																type="submit"
																className="button is-fullwidth is-danger is-full is-large"
															>
																Get the code
															</button>
														</div>
													</div>
												</Form>
											)}
										</Formik>
									</div>
								) : (
									<div>
										<p className="title has-text-centered">Enter the code you just recieved</p>
										<Timer initialTime={120000} direction="backward">
											{() => (
												<p className="subtitle has-text-centered">
													<Timer.Minutes /> : <Timer.Seconds />
												</p>
											)}
										</Timer>
										<Formik
											initialValues={{ code: '' }}
											// validate={validationSchema}
											onSubmit={async ({ code }, { setSubmitting }) => {
												const { data } = await validateCode({ variables: { code } });
												if (data.validateCode && data.validateCode.id) setCode(true);
											}}
										>
											{({ errors, values, isSubmitting }) => (
												<Form>
													<div className="field has-addons has-addons-centered is-hidden-mobile">
														<FastField
															name="code"
															label="code"
															icon="unlock"
															size="large"
															component={Input}
															mask="999 999"
															placeholder="Enter your code"
														/>
														<div className="control">
															<button type="submit" className="button is-danger is-large">
																Validate code
															</button>
														</div>
													</div>
													<div className="field is-hidden-desktop is-hidden-tablet">
														<FastField
															name="code"
															label="code"
															icon="unlock"
															size="large"
															component={Input}
															mask="999 999"
															placeholder="Enter your code"
														/>
														<br />
														<div className="control">
															<button
																type="submit"
																className="button is-fullwidth is-danger is-large"
															>
																Validate code
															</button>
														</div>
													</div>
												</Form>
											)}
										</Formik>
										<br />

										<p className="subtitle is-size-5 has-text-centered">
											<a onClick={() => setSent(false)}>
												Didn't get the text message? Try again!
											</a>
										</p>
									</div>
								)}
							</div>
						</Columns>
					</Container>
				</div>

				<div className="hero-foot">
					<nav className="is-fullwidth">
						<div className="container">
							<p>© 2020 Cloud9</p>
						</div>
					</nav>
				</div>
			</section>
		</Box>
	);
}

const validationSchema = object().shape({
	code: string().required('Please enter the code from the text messsage!')
});

const SEND_CODE = gql`
	mutation SendCode($phone: String!) {
		sendCode(phone: $phone)
	}
`;

const VALIDATE_CODE = gql`
	mutation ValidateCode($code: String!) {
		validateCode(code: $code) {
			id
			phone
		}
	}
`;
