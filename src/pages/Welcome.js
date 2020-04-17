import React, { useEffect, useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Columns, Container } from 'components/ui/bulma';
import { Button, Box, Input } from 'components/ui/bulma';

import Timer from 'react-compound-timer';
import { FastField, Formik, Form } from 'formik';
import { object, string } from 'yup';

import { useAuthState } from 'react-firebase-hooks/auth';
import { firebaseAppAuth } from 'services/firebase';

import logo from 'assets/logo.png';

export default function Welcome({ code, setCode, setPhone }) {
	const [ sent, setSent ] = useState();
	const [ sendCode ] = useMutation(SEND_CODE);
	const [ validateCode ] = useMutation(VALIDATE_CODE);

	return (
		<section className="hero is-info is-fullheight">
			<div class="hero-head has-background-link">
				<nav class="navbar">
					<div class="container">
						<div class="navbar-brand">
							<a class="navbar-item">
								<img src="https://bulma.io/images/bulma-type-white.png" alt="Logo" />
							</a>
							{/* <span class="navbar-burger burger" data-target="navbarMenuHeroA">
								<span />
								<span />
								<span />
							</span> */}
						</div>
						{/* <div id="navbarMenuHeroA" class="navbar-menu">
							<div class="navbar-end">
								<a class="navbar-item is-active">Home</a>
								<a class="navbar-item">Examples</a>
								<a class="navbar-item">Documentation</a>
								<span class="navbar-item">
									<a class="button is-primary is-inverted">
										<span class="icon">
											<i class="fab fa-github" />
										</span>
										<span>Download</span>
									</a>
								</span>
							</div>
						</div> */}
					</div>
				</nav>
			</div>
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
									<p className="title is-size-1 has-text-centered">Art &amp; Initiative 71 Gifts</p>
									<p className="subtitle is-size-3 has-text-centered">straight to your doorstep</p>
									<br />
									<Formik
										initialValues={{ phone: '' }}
										// validate={validationSchema}
										onSubmit={async ({ phone }, { setSubmitting }) => {
											setSent(true);
											setPhone(phone);
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
														mask="(999) 999-9999"
														placeholder="Mobile number..."
													/>

													<div className="control">
														<button
															type="submit"
															className="button is-danger is-full is-large"
														>
															Login
														</button>
													</div>
												</div>
												<div className="field is-hidden-desktop is-hidden-tablet">
													<FastField
														name="phone"
														icon="mobile-alt"
														size="large"
														component={Input}
														mask="(999) 999-9999"
														placeholder="Mobile number..."
													/>
													<br />
													<div className="control">
														<button
															type="submit"
															className="button is-fullwidth is-danger is-full is-large"
														>
															Login
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
										<a onClick={() => setSent(false)}>Didn't get the text message? Try again!</a>
									</p>
								</div>
							)}
						</div>
					</Columns>
				</Container>
			</div>

			<div class="hero-foot has-background-link">
				<div class="container has-text-centered">
					<br />

					<p>
						<FontAwesomeIcon icon="phone-alt" color="white" />{' '}
						<a className="has-text-white" href="tel:2029219888">
							Need Help? Give us a call
						</a>
					</p>
					<br />
				</div>
			</div>
		</section>
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
