import React, { useState } from 'react';

import { firebaseAppAuth } from 'services/firebase';

import { Formik, Form, Field } from 'formik';
import { Image, Transformation } from 'cloudinary-react';

import { Columns, Column, Container } from 'components/ui/bulma/layout';
import { Box, Button, Notification } from 'components/ui/bulma/elements';
import { Input } from 'components/ui/bulma/form';

import logo from 'assets/mark-logo.png';

export default function AuthPage() {
	const [ isLogin, toggleLogin ] = useState(false);
	const [ isReset, toggleReset ] = useState(false);

	// useEffect(
	// 	() => {
	// 		if (user && data && data.accounts[0])
	// 			window.analytics.identify(user.uid, {
	// 				name: user.displayName,
	// 				email: user.email,
	// 				company: {
	// 					id: data.accounts[0].id,
	// 					name: data.accounts[0].name
	// 				},
	// 				createdAt: user.metadata.creationTime
	// 			});

	// 		// window.analytics.page('account');
	// 	},
	// 	[ user, data ]
	// );

	return (
		<section className="hero is-fullheight">
			<div className="hero-head">
				<nav className="navbar">
					<div className="container">
						<div className="navbar-brand">
							<a className="navbar-item">
								<img src={logo} alt="Mark" />
							</a>
							{/* <span className="navbar-burger burger" data-target="navbarMenuHeroB">
									<span />
									<span />
									<span />
								</span> */}
						</div>
						{/* <div id="navbarMenuHeroB" className="navbar-menu">
								<div className="navbar-end">
									<a className="navbar-item is-active">Home</a>
									<a className="navbar-item">Examples</a>
									<a className="navbar-item">Documentation</a>
									<span className="navbar-item">
										<a className="button is-info is-inverted">
											<span className="icon">
												<i className="fab fa-github" />
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
						<Column size="half">
							<h1 className="title is-4">
								{isReset ? 'Reset password' : isLogin ? 'Sign In' : 'Create free account'}
							</h1>

							<Box>
								{isReset ? <Reset /> : isLogin ? <Login /> : <SignUp />}
								<br />

								{isReset || (
									<Button color="text" action={() => toggleLogin(!isLogin)}>
										<strong>{isLogin ? 'No account? Sign up' : 'Have an account? Sign in'} </strong>
									</Button>
								)}
								<Button color="text" action={() => toggleReset(!isReset)}>
									<strong>{isReset ? 'Back' : 'Reset password'}</strong>
								</Button>
							</Box>
						</Column>
						<Column size="half">
							<Box>
								<h1 className="title is-4">Promote your business on Instagram</h1>
								<h2 className="subtitle">This is how it would look like</h2>
								<figure className="image">
									<Image
										cloudName="hqsczucpx"
										publicId="assets/example.jpg"
										dpr="auto"
										responsive
										width="auto"
										crop="fit"
									>
										<Transformation quality="auto" />
										<Transformation
											overlay="creative:SampleLogo.png"
											gravity="north_west"
											x="10"
											y="10"
											width="0.25"
											flags="relative"
											// effect="screen"
										/>
									</Image>
								</figure>
							</Box>
						</Column>
					</Columns>
				</Container>
			</div>

			<div className="hero-foot">
				<nav className="is-fullwidth">
					<div className="container">
						<p>© 2019 Mark</p>
					</div>
				</nav>
			</div>
		</section>
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
					icon="lock"
					component={Input}
					placeholder="Password"
					autoComplete="current-password"
				/>
				<br />
				{status && <Notification>{status}</Notification>}
				<Button full type="submit" color="primary" icon="check-circle">
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
					component={Input}
					placeholder="Password"
					autoComplete="current-password"
				/>
				<br />
				{status && <Notification color="danger">{status}</Notification>}
				<Button full type="submit" color="primary" icon="key">
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
					component={Input}
					placeholder="Email"
					autoComplete="username"
				/>
				<br />
				{status && <Notification>{status}</Notification>}
				<Button full type="submit" color="primary" icon="envelope" disabled={isSubmitting}>
					Reset Password
				</Button>
			</Form>
		)}
	</Formik>
);
