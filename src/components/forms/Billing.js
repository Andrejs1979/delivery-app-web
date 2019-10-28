import React, { useState } from 'react';
import useScript from '@charlietango/use-script';

import { useFormikContext } from 'formik';
import { StripeProvider, Elements, CardElement, injectStripe } from 'react-stripe-elements';

import { Box, Button, Icon } from 'components/ui/bulma/elements';
import { Columns, Column, Left, Level, Item } from 'components/ui/bulma/layout';

const STRIPE = 'https://js.stripe.com/v3/';

export default function Billing() {
	const [ ready ] = useScript(STRIPE);

	if (ready)
		return (
			<Columns>
				<Column>
					<Box>
						<p className="title is-4">Enter your card</p>
						<p className="subtitle">
							We will take a refundable $20 deposit and save payment info for future charges
						</p>
						<br />
						<Level>
							<Left>
								<Item>
									<Icon brand name="cc-visa" container="medium" size="2x" color="dark" />
								</Item>

								<Item>
									<Icon brand name="cc-mastercard" container="medium" size="2x" color="dark" />
								</Item>

								<Item>
									<Icon brand name="cc-amex" container="medium" size="2x" color="dark" />
								</Item>

								<Item>
									<Icon brand name="cc-discover" container="medium" size="2x" color="dark" />
								</Item>
							</Left>
						</Level>
						<br />
						<StripeProvider apiKey="pk_test_HBIhZrPHQdlwv18IxhN5CIW200t5RZNUPd">
							<Elements>
								<PaymentForm />
							</Elements>
						</StripeProvider>
						<br />
						<Icon name="shield-alt" container="medium" size="sm" />Your card info is secure
					</Box>
				</Column>
				<Column>
					<Box>
						<article className="message is-dark is-small">
							<div className="message-body">
								<div className="content">
									<h5 className="title is-5">How our billing works</h5>
									<ul>
										<li>
											<strong>Account balance.</strong> Your account has a cash balance, which is
											used to pay rewards to your promoters. The balance and transactions are
											available on the dashboard in real-time.
										</li>
										<li>
											<strong>Spending Limits.</strong> Your campaign is running as long as your
											balance is positive, but it pauses automatically once your spending limit is
											reached. You can change this limit at any time.
										</li>

										<li>
											<strong>Automatic charges.</strong> You give us your permission to
											automatically top up your account balance from your card when required,
											according to your spending limits.
										</li>
										<li>
											<strong>Risk free.</strong> The unused balance on your account can be
											refunded at your request at any time, no questions asked.
										</li>
									</ul>
								</div>
							</div>
						</article>
					</Box>
				</Column>
			</Columns>
		);

	return null;
}

const _PaymentForm = ({ stripe }) => {
	const [ loading, setLoading ] = useState(false);
	const { values, errors, setFieldValue } = useFormikContext();

	const tokenize = async () => {
		setLoading(true);
		const { token, error } = await stripe.createToken();

		if (error) console.log(error);

		if (token) {
			setFieldValue('cardToken', token.id);
			setFieldValue('card', token.card);
		}
		setLoading(false);
	};

	return (
		<div className="checkout">
			<CardElement
				style={{
					base: {
						fontSize: '20px'
					},
					invalid: {
						color: '#c23d4b'
					}
				}}
			/>
			{!loading && <p className="help is-danger">{errors.cardToken}</p>}
			<hr />
			{!values.cardToken ? (
				<Button
					color={!loading && errors.cardToken ? 'danger' : 'primary'}
					size="medium"
					icon="credit-card"
					action={() => tokenize()}
					loading={loading}
				>
					Save your card
				</Button>
			) : (
				<Button
					color="success"
					size="medium"
					icon="check-circle"
					action={() => tokenize()}
					loading={loading}
					disabled
				>
					Card saved
				</Button>
			)}
		</div>
	);
};

const PaymentForm = injectStripe(_PaymentForm);
