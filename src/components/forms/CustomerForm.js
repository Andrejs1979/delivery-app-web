import React, { useContext } from 'react';
import { gql, useMutation } from '@apollo/client';

import { Formik, Form, FastField } from 'formik';
import * as Yup from 'yup';

import { Box, Button } from 'components/ui/bulma';
import { Input } from 'components/ui/bulma';

import Modal from 'components/ui/Modal';
import Spinner from 'components/ui/Spinner';
import Error from 'components/ui/Error';

import customerName from 'utils/customerName';

import UserContext from 'context/UserContext';

export default function CustomerForm({ item, onClose }) {
	const { headers } = useContext(UserContext);

	const [ createConsumer, { data, loading, error } ] = useMutation(CREATE_CUSTOMER, {
		context: { headers },
		refetchQueries: [ 'Account', 'Customers' ]
	});

	const [ update, { data: updateData, loading: updateLoading, error: updateError } ] = useMutation(UPDATE, {
		context: { headers },
		refetchQueries: [ 'Account', 'ConsumerDetails' ]
	});

	if (error) return <Error />;
	if (loading)
		return (
			<div className="columns is-mobile is-centered">
				<div className="column is-half">
					<Box>
						<Spinner />
					</Box>
				</div>
			</div>
		);

	if (data && data.createConsumer && data.createConsumer.id)
		return (
			<div className="container">
				<div className="columns is-centered">
					<div className="column is-half has-text-centered">
						<Box>
							<span className="icon is-large has-text-success">
								<i className="fas fa-check-circle fa-3x" />
							</span>

							<br />
							<h1 className="title is-3">
								Customer {customerName(data.createConsumer)} has been created.
							</h1>
							<button onClick={onClose} className="button is-large is-fullwidth">
								Close
							</button>
						</Box>
					</div>
				</div>
			</div>
		);

	if (updateData)
		return (
			<div className="container">
				<div className="columns is-centered">
					<div className="column is-half has-text-centered">
						<Box>
							<span className="icon is-large has-text-success">
								<i className="fas fa-check-circle fa-3x" />
							</span>

							<br />
							<h1 className="title is-3">You changes have been saved.</h1>
							<button onClick={onClose} className="button is-large is-fullwidth">
								Close
							</button>
						</Box>
					</div>
				</div>
			</div>
		);

	return (
		<Formik
			initialValues={{
				email: item ? item.email : '',
				firstName: item ? item.firstName : '',
				lastName: item ? item.lastName : ''
			}}
			validationSchema={validationSchema}
			onSubmit={({ email, firstName, lastName }) => {
				if (!item) {
					const consumerProps = {
						email,
						firstName,
						lastName
					};

					createConsumer({
						variables: {
							consumerProps
						}
					});
				} else {
					const consumerProps = {
						id: item.id,
						email,
						firstName,
						lastName
					};

					update({
						variables: {
							consumerProps
						}
					});
				}
			}}
		>
			{({ isSubmitting, values }) => (
				<Modal icon="credit-card" title="Customer" onClose={onClose}>
					<Form>
						<FastField
							name="email"
							label="Email"
							icon="at"
							size="large"
							component={Input}
							placeholder="Email"
						/>
						<br />
						<FastField
							name="firstName"
							label="First name (optional)"
							icon="user"
							size="large"
							component={Input}
							placeholder="First name"
						/>
						<br />
						<FastField
							name="lastName"
							label="Last name (optional)"
							icon="users"
							size="large"
							component={Input}
							placeholder="Last name"
						/>
						<hr />
						<Button type="submit" block size="large" icon="check-circle" disabled={isSubmitting}>
							{!item ? 'Add customer' : 'Save changes'}
						</Button>
					</Form>
				</Modal>
			)}
		</Formik>
	);
}

const validationSchema = Yup.object().shape({
	email: Yup.string().email('Invalid email').required('Please enter the customers email!'),
	firstName: Yup.string().min(2, 'Too Short!').max(20, 'Too Long!'),
	lastName: Yup.string().min(2, 'Too Short!').max(20, 'Too Long!')
});

const CREATE_CUSTOMER = gql`
	mutation CreateConsumer($consumerProps: ConsumerProps) {
		createConsumer(consumerProps: $consumerProps) {
			id
			email
			firstName
			lastName
		}
	}
`;

const UPDATE = gql`
	mutation UpdateCustomer($consumerProps: ConsumerProps) {
		updateConsumer(consumerProps: $consumerProps) {
			id
			firstName
			lastName
			email
			phone
			address
		}
	}
`;
