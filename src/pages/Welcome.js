import React, { useEffect, useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Menu from 'components/ui/Menu';
import { Container, Columns, Column, Box, Button, Input } from 'components/ui/bulma';

import Timer from 'react-compound-timer';
import { FastField, Formik, Form } from 'formik';
import { object, string } from 'yup';

import { useAuthState } from 'react-firebase-hooks/auth';
import { firebaseAppAuth } from 'services/firebase';

import logo from 'assets/logo.png';

export default function Welcome({ code, setCode, setPhone }) {
	const [ extended, setExtended ] = useState(false);
	const [ sent, setSent ] = useState();
	const [ sendCode ] = useMutation(SEND_CODE);
	const [ validateCode ] = useMutation(VALIDATE_CODE);

	return (
		<section className="hero is-info is-fullheight">
			<div className="hero-head has-background-light">
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

			<div className="hero-foot has-background-light">
				<div className="container has-text-centered">
					<br />

					<p>
						<FontAwesomeIcon icon="phone-alt" color="black" />{' '}
						<a className="title is-size-6 has-text-black" style={{ marginLeft: 10 }} href="tel:2029219888">
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
