import React, { useContext, useState, useEffect } from 'react';
import { gql, useMutation } from '@apollo/client';
import { format, addDays, setHours, differenceInHours, startOfHour } from 'date-fns';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// import useScript from '@charlietango/use-script';
// import { StripeProvider, Elements, CardElement, injectStripe } from 'react-stripe-elements';
import { useStripe, useElements, Elements, CardElement } from '@stripe/react-stripe-js';
import { paymentIntents, loadStripe } from '@stripe/stripe-js';
import 'styles/CardSectionStyles.css';

import { Hero } from 'components/ui/bulma';
import { Box, Button, ButtonGroup } from 'components/ui/bulma';
// import { Input } from 'components/ui/bulma';

const stripePromise = loadStripe('pk_test_xzpr0wSRpogemBQup8WLtrQW006uS5xBMe');
const STRIPE_SECRET = 'sk_test_sTqpemWAIZHdMyfJI8NDlJXN00zlTS11Ll';

const CARD_ELEMENT_OPTIONS = {
	style: {
		base: {
			color: '#32325d',
			fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
			fontSmoothing: 'antialiased',
			fontSize: '16px',
			'::placeholder': {
				color: '#aab7c4'
			}
		},
		invalid: {
			color: '#fa755a',
			iconColor: '#fa755a'
		}
	}
};

const items = [
	{
		id: '5e84813c1c9d440000a35281',
		title: 'Small Poster',
		image: 'https://res.cloudinary.com/fastlabs/image/upload/v1585745990/delivery/poster40_y29kdb.jpg',
		price: '40'
	},
	{
		id: '5e848cdd1c9d440000a35282',
		title: 'Medium Poster',
		image: 'https://res.cloudinary.com/fastlabs/image/upload/v1585745990/delivery/poster60_q1rlkb.jpg',
		price: '60'
	},
	{
		id: '5e848cef1c9d440000a35283',
		title: 'Large Poster',
		image: 'https://res.cloudinary.com/fastlabs/image/upload/v1585745989/delivery/poster70_fkayov.jpg',
		price: '70'
	}
];

const slots = [
	{ title: 'Today', subtitle: 'Morning', start: setHours(Date.now(), 9), slot: '9am - 12pm' },
	{ title: 'Today', subtitle: 'Midday', start: setHours(Date.now(), 12), slot: '12pm - 3pm' },
	{ title: 'Today', subtitle: 'Afternoon', start: setHours(Date.now(), 15), slot: '3pm - 6pm' },
	{ title: 'Today', subtitle: 'Evening', start: setHours(Date.now(), 18), slot: '6pm - 9pm' },
	{ title: 'Tomorrow', subtitle: 'Morning', start: setHours(addDays(Date.now(), 1), 9), slot: '9am - 12pm' },
	{ title: 'Tomorrow', subtitle: 'Midday', start: setHours(addDays(Date.now(), 1), 12), slot: '12pm - 3pm' },
	{ title: 'Tomorrow', subtitle: 'Afternoon', start: setHours(addDays(Date.now(), 1), 15), slot: '3pm - 6pm' },
	{ title: 'Tomorrow', subtitle: 'Evening', start: setHours(addDays(Date.now(), 1), 18), slot: '6pm - 9pm' }
];

var settings = {
	dots: true,
	infinite: true,
	speed: 500,
	slidesToShow: 1,
	slidesToScroll: 1
};

export default function Order({ address, onClose }) {
	const [ item, setItem ] = useState();
	const [ image, setImage ] = useState();
	const [ payment, setPayment ] = useState();
	const [ deliverySlot, setDelivery ] = useState();
	const [ accept, setAccept ] = useState();
	const [ finish, setFinish ] = useState();

	const [ createOrder ] = useMutation(CREATE_ORDER);

	useEffect(
		() => {
			if (finish && accept) {
				const orderProps = { address, item, deliverySlot };

				try {
					createOrder({ variables: { orderProps } });
					onClose();
				} catch (error) {
					console.log(error);
				}
			}
		},
		[ item, deliverySlot, address, accept, finish ]
	);

	useEffect(
		() => {
			if (item && deliverySlot) {
				const { image } = items.find((i) => i.id === item);
				setImage(image);
			}
		},
		[ item, deliverySlot ]
	);

	return (
		<Hero>
			<div className="columns is-mobile is-centered">
				{!item &&
				!deliverySlot && (
					<div className="column is-half-desktop is-12-mobile">
						<Box>
							<p className="title is-size-4-mobile">Choose your artwork</p>

							<Slider {...settings}>
								{items.map((item) => (
									<div className="box" key={item.id}>
										<img src={item.image} />
										<p className="title">{item.title}</p>
										<p className="subtitle">${item.price}</p>
										<Button
											block
											color="danger"
											size="medium"
											icon="check-circle"
											action={() => setItem(item.id)}
										>
											Buy now
										</Button>
									</div>
								))}
							</Slider>
						</Box>
					</div>
				)}

				{item &&
				!deliverySlot && (
					<div className="column is-half-desktop is-12-mobile">
						<Box>
							<p className="title is-size-4-mobile">Select your delivery slot</p>
							<Slider {...settings}>
								{slots.map((slot) => {
									let available;

									differenceInHours(slot.start, Date.now()) > 0
										? (available = true)
										: (available = false);

									if (available)
										return (
											<div className="tile is-parent" key={slot.start}>
												<div className="tile is-child box">
													<span className="icon is-large">
														<i className="fas fa-3x fa-store" />
													</span>

													<p className="title">{slot.title}</p>
													<p className="subtitle">{slot.slot}</p>
													<Button
														color="danger"
														size="medium"
														icon="check-circle"
														action={() => setDelivery(slot.start)}
														disabled={available ? false : true}
													>
														{available ? 'Book delivery' : 'Not available'}
													</Button>
												</div>
											</div>
										);
								})}
							</Slider>
							<Button color="text" action={() => setItem(null)}>
								Back
							</Button>
						</Box>
					</div>
				)}

				{item &&
				deliverySlot &&
				!payment && (
					<div className="column is-half-desktop is-12-mobile">
						{console.log(item)}
						<Box>
							<p className="title is-size-4-mobile">Please enter your card</p>
							<Elements stripe={stripePromise}>
								<CheckoutForm
									item={items.find((inventory) => inventory.id === item)}
									setPayment={setPayment}
								/>
							</Elements>
						</Box>
					</div>
				)}

				{item &&
				deliverySlot &&
				payment && (
					<div className="column is-half-desktop is-12-mobile">
						<Box>
							{/* <p className="title">Thank you!</p> */}
							<img src={image} />

							<p className="title is-size-5">
								Your item will be delivered at {address} at or after{' '}
								{format(deliverySlot, 'MM/dd/yyyy hh a')}.
							</p>
							<p className="subtitle is-size-6">Please check your text messages for your gift code!</p>
							<label className="checkbox">
								<input type="checkbox" onChange={() => setAccept(true)} />
								I agree with the Terms&amp;Conditions and Privacy Policy.
							</label>
							<Button
								color="danger"
								size="medium"
								icon="check-circle"
								disabled={!accept}
								action={() => setFinish(true)}
							>
								Finish
							</Button>
						</Box>
					</div>
				)}
			</div>
		</Hero>
	);
}

function CheckoutForm({ item, setPayment }) {
	const stripe = useStripe();
	const elements = useElements();

	const amount = item.price;
	const [ submit, setSubmit ] = useState();
	const [ loading, setLoading ] = useState();

	const [ processPayment ] = useMutation(PROCESS_PAYMENT, { variables: { amount } });

	useEffect(
		() => {
			const handleSubmit = async (amount) => {
				setLoading(true);
				const result = await stripe.createPaymentMethod({
					type: 'card',
					card: elements.getElement(CardElement)
				});

				if (result.error) {
					console.log(result.error);
				} else {
					const response = await processPayment({
						variables: { amount, paymentMethodID: result.paymentMethod.id }
					});

					if (response.error) {
						console.log(response.error);
					} else {
						console.log(response);
						if (response.data.processPayment === 'approved') setPayment(true);
					}
				}
				setLoading(false);
			};

			if (amount && submit) handleSubmit(amount);
		},
		[ amount, submit ]
	);

	const handleCardChange = (event) => {
		if (event.error) {
			console.log(event.error);
		}
	};

	return (
		<div>
			<CardElement onChange={handleCardChange} />
			<br />
			<Button
				block
				icon="check-circle"
				size="medium"
				color="danger"
				loading={loading}
				disabled={!stripe}
				action={() => setSubmit(true)}
			>
				Confirm order
			</Button>
		</div>
	);
}

const CREATE_ORDER = gql`
	mutation CreateOrder($orderProps: OrderProps) {
		createOrder(orderProps: $orderProps) {
			id
		}
	}
`;

const PROCESS_PAYMENT = gql`
	mutation ProcessPayment($amount: String!, $paymentMethodID: String!) {
		processPayment(amount: $amount, paymentMethodID: $paymentMethodID)
	}
`;
