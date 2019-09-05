import React, { useState } from 'react';

import { firebaseAppAuth } from 'services/firebase';

import { Formik, Form, Field } from 'formik';

import { Hero, Footer } from 'components/ui/bulma/layout';
import { Box, Button, Notification } from 'components/ui/bulma/elements';
import { Input } from 'components/ui/bulma/form';

export default function AuthPage({ props }) {
	const [ mode, setMode ] = useState('signUp');
	console.log(mode);

	return (
		<div>
			<Hero>
				<div className="columns is-mobile is-centered">
					<div className="column is-half">
						<h1 className="title">Create Account</h1>
						{/* <h2 className="subtitle">Fullheight subtitle</h2> */}
						<Box>
							<Auth mode={mode} />
							<br />
							<button onClick={() => setMode('Login')}>
								<strong>Have an account? Sign in</strong>
							</button>
						</Box>
					</div>
				</div>
			</Hero>
			<Footer>©2019 Cashmark</Footer>
		</div>
	);
}

const Auth = ({ mode }) => (
	<Formik
		component={authForm}
		initialValues={{
			email: '',
			password: ''
		}}
		validate={(values) => {
			let errors = {};

			if (!values.email) {
				errors.email = 'Please enter your email!';
			} else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,5}$/i.test(values.email))
				errors.email = 'This email address is invalid';

			if (!values.password) {
				errors.password = 'Password is required!';
			} else if (values.password.length < 8) {
				errors.password = 'Password should be longer!';
			}

			return errors;
		}}
		onSubmit={async (values, { setSubmitting, setStatus, setErrors }) => {
			setSubmitting(true);

			if (mode === 'signUp') {
				try {
					await firebaseAppAuth.createUserWithEmailAndPassword(values.email, values.password);
				} catch (error) {
					console.log(error);
					if (error.code === 'auth/email-already-in-use') {
						try {
							await firebaseAppAuth.signInWithEmailAndPassword(values.email, values.password);
						} catch (error) {
							setStatus(error.message);
						}
					} else {
						setStatus(error.message);
					}
				}
			} else {
				try {
					await firebaseAppAuth.signInWithEmailAndPassword(values.email, values.password);
				} catch (error) {
					setStatus(error.message);
				}
			}

			setSubmitting(false);
		}}
	/>
);

const authForm = ({ status, isSubmitting, handleSubmit, handleChange, handleBlur, values, touched, errors }) => (
	<Form>
		<Field label="Email" name="email" component={Input} placeholder="Email" autoComplete="username" />
		<br />
		<Field
			label="Password"
			name="password"
			type="password"
			component={Input}
			placeholder="Password"
			autoComplete="current-password"
		/>
		<br />
		{status && <Notification>{status}</Notification>}
		<Button color="primary" size="large" icon="check-circle">
			Create Account
		</Button>
	</Form>
);

// const renderReset = () => (
// 	<Card>
// 		<center>
// 			<Heading>Reset your password</Heading>
// 		</center>
// 		<br />
// 		<Formik
// 			initialValues={{
// 				email: ''
// 			}}
// 			validate={(values) => {
// 				let errors = {};

// 				if (!values.email) {
// 					errors.email = 'Please enter your email!';
// 				} else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,5}$/i.test(values.email))
// 					errors.email = 'This email address is invalid';

// 				return errors;
// 			}}
// 			onSubmit={(values, { setSubmitting, setErrors }) => {
// 				firebaseAppAuth
// 					.sendPasswordResetEmail(values.email)
// 					.then(() => this.setState({ resetSuccess: true }))
// 					.catch((error) => this.setState({ error }));

// 				setSubmitting(false);
// 			}}
// 		>
// 			{({ isSubmitting, handleSubmit, handleChange, handleBlur, values, touched, errors }) => (
// 				<Form>
// 					<Field>
// 						<Input
// 							type="text"
// 							name="email"
// 							value={values.email}
// 							onChange={handleChange}
// 							onBlur={handleBlur}
// 							placeholder="Account Email"
// 							invalid={errors.email && touched.email}
// 							autoComplete="username"
// 						/>
// 						{errors.email && touched.email && <Help>{errors.email}</Help>}
// 					</Field>

// 					<Field>
// 						<Button type="submit" color="primary" disabled={isSubmitting}>
// 							Reset Password
// 							{/* <ChevronRight className="button-icon-xs" /> */}
// 						</Button>
// 						{this.state.resetSuccess && (
// 							<Notification color="success">Please check your email for the next steps.</Notification>
// 						)}
// 						{this.props.error && <Notification color="danger">{this.props.error}</Notification>}
// 						<br />
// 						<hr />
// 						<center>
// 							<h5>
// 								<Link to="" onClick={this.toggleReset}>
// 									Back to sign in
// 								</Link>
// 							</h5>
// 						</center>
// 					</Field>
// 				</Form>
// 			)}
// 		</Formik>
// 	</Card>
// );
