import React, { useState } from 'react';

import { firebaseAppAuth } from 'services/firebase';

import { Formik, Form, Field } from 'formik';

import { Hero } from 'components/ui/bulma/layout';
import { Box, Button, Notification } from 'components/ui/bulma/elements';
import { Input } from 'components/ui/bulma/form';

export default function AuthPage() {
	const [ isLogin, toggleLogin ] = useState(false);
	const [ isReset, toggleReset ] = useState(false);

	return (
		<Hero>
			<div className="columns is-mobile is-centered">
				<div className="column is-half">
					<h1 className="title">{isReset ? 'Reset password' : isLogin ? 'Sign In' : 'Create Account'}</h1>
					{/* <h2 className="subtitle">Fullheight subtitle</h2> */}

					<Box>
						{isReset ? <Reset /> : isLogin ? <Login /> : <SignUp />}
						<br />
						<div className="field is-grouped">
							{isReset || (
								<Button color="text" action={() => toggleLogin(!isLogin)}>
									<strong>{isLogin ? 'No account? Sign up' : 'Have an account? Sign in'} </strong>
								</Button>
							)}
							<Button color="text" action={() => toggleReset(!isReset)}>
								<strong>{isReset ? 'Back' : 'Reset Password'}</strong>
							</Button>
						</div>
					</Box>
					<p>© 2019 Cashmark</p>
				</div>
			</div>
		</Hero>
	);
}

const validate = (values) => {
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
};

const handleAuth = async (values, { setSubmitting, setStatus, setErrors }) => {
	setSubmitting(true);

	try {
		await firebaseAppAuth.createUserWithEmailAndPassword(values.email, values.password);
	} catch (error) {
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

	setSubmitting(false);
};

const SignUp = () => (
	<Formik
		initialValues={{
			email: '',
			password: ''
		}}
		validate={validate}
		onSubmit={handleAuth}
	>
		{({ status, isSubmitting, handleSubmit, handleChange, handleBlur, values, touched, errors }) => (
			<Form>
				<Field
					name="email"
					label="Business Email"
					size="large"
					icon="at"
					component={Input}
					placeholder="Email"
					autoComplete="username"
				/>
				<br />
				<Field
					name="password"
					type="password"
					label="Set your password"
					size="large"
					icon="lock"
					component={Input}
					placeholder="Password"
					autoComplete="current-password"
				/>
				<br />
				{status && <Notification>{status}</Notification>}
				<Button full type="submit" color="primary" size="large" icon="check-circle">
					Create Account
				</Button>
			</Form>
		)}
	</Formik>
);
const Login = () => (
	<Formik
		initialValues={{
			email: '',
			password: ''
		}}
		validate={validate}
		onSubmit={handleAuth}
	>
		{({ status, isSubmitting, handleSubmit, handleChange, handleBlur, values, touched, errors }) => (
			<Form>
				<Field
					label="Email"
					name="email"
					icon="at"
					size="large"
					component={Input}
					placeholder="Email"
					autoComplete="username"
				/>
				<br />
				<Field
					label="Password"
					name="password"
					type="password"
					icon="lock"
					size="large"
					component={Input}
					placeholder="Password"
					autoComplete="current-password"
				/>
				<br />
				{status && <Notification color="danger">{status}</Notification>}
				<Button full type="submit" color="primary" size="large" icon="key">
					Sign In
				</Button>
			</Form>
		)}
	</Formik>
);

const Reset = () => (
	<Formik
		initialValues={{
			email: ''
		}}
		validate={(values) => {
			let errors = {};

			if (!values.email) {
				errors.email = 'Please enter your email!';
			} else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,5}$/i.test(values.email))
				errors.email = 'This email address is invalid';

			return errors;
		}}
		onSubmit={(values, { setSubmitting, setStatus }) => {
			try {
				firebaseAppAuth
					.sendPasswordResetEmail(values.email)
					.then(() => setStatus('Please check your email for the next steps.'));
			} catch (error) {
				setStatus(error.message);
			}

			setSubmitting(false);
		}}
	>
		{({ status, isSubmitting, handleSubmit, handleChange, handleBlur, values, touched, errors }) => (
			<Form>
				<Field
					name="email"
					label="Account Email"
					icon="at"
					size="large"
					component={Input}
					placeholder="Email"
					autoComplete="username"
				/>
				<br />
				{status && <Notification>{status}</Notification>}
				<Button full type="submit" color="primary" size="large" icon="envelope" disabled={isSubmitting}>
					Reset Password
				</Button>
			</Form>
		)}
	</Formik>
);
