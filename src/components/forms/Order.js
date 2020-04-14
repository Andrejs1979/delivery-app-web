import React, { useContext, useState, useEffect } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';

import { format, addDays, setHours, differenceInHours, startOfHour } from 'date-fns';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { Image } from 'cloudinary-react';

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

const slots = [
	{ title: 'Today', subtitle: 'Morning', start: startOfHour(setHours(Date.now(), 9)), slot: '9am - 12pm' },
	{ title: 'Today', subtitle: 'Midday', start: startOfHour(setHours(Date.now(), 12)), slot: '12pm - 3pm' },
	{ title: 'Today', subtitle: 'Afternoon', start: startOfHour(setHours(Date.now(), 15)), slot: '3pm - 6pm' },
	{ title: 'Today', subtitle: 'Evening', start: startOfHour(setHours(Date.now(), 18)), slot: '6pm - 9pm' },
	{
		title: 'Tomorrow',
		subtitle: 'Morning',
		start: startOfHour(setHours(addDays(Date.now(), 1), 9)),
		slot: '9am - 12pm'
	},
	{
		title: 'Tomorrow',
		subtitle: 'Midday',
		start: startOfHour(setHours(addDays(Date.now(), 1), 12)),
		slot: '12pm - 3pm'
	},
	{
		title: 'Tomorrow',
		subtitle: 'Afternoon',
		start: startOfHour(setHours(addDays(Date.now(), 1), 15)),
		slot: '3pm - 6pm'
	},
	{
		title: 'Tomorrow',
		subtitle: 'Evening',
		start: startOfHour(setHours(addDays(Date.now(), 1), 18)),
		slot: '6pm - 9pm'
	}
];

var settings = {
	dots: true,
	infinite: true,
	speed: 500,
	slidesToShow: 1,
	slidesToScroll: 1
};

export default function Order({ address, phone }) {
	const [ item, setItem ] = useState();
	const [ image, setImage ] = useState();
	// const [ payment, setPayment ] = useState();
	const [ day, setDay ] = useState();
	const [ deliveryDateTime, setDelivery ] = useState();
	const [ accept, setAccept ] = useState();
	const [ confirm, setConfirm ] = useState();
	const [ finish, setFinish ] = useState();

	const { loading, data, error } = useQuery(ITEMS);
	const [ createOrder ] = useMutation(CREATE_ORDER);

	useEffect(
		() => {
			if (finish && accept) {
				const orderProps = { address, phone, item, deliveryDateTime };
				console.log(address, phone, item, deliveryDateTime);

				try {
					createOrder({ variables: { orderProps } });
				} catch (error) {
					console.log(error);
				}
			}
		},
		[ item, deliveryDateTime, address, phone, accept, finish ]
	);

	useEffect(
		() => {
			if (item && deliveryDateTime) {
				const { image } = data.items.find((i) => i.id === item);
				setImage(image);
			}
		},
		[ item, deliveryDateTime ]
	);

	if (!finish)
		return (
			<div>
				{!item &&
				!deliveryDateTime &&
				!confirm && (
					<div>
						{data &&
							data.items.map((item) => (
								<div className="box has-background-light" key={item.id}>
									<article class="media" style={{ marginBottom: 10 }}>
										<figure class="media-left">
											<p class="image is-64x64">
												<Image publicId={`delivery/${item.picture}`} height="50" />
											</p>
										</figure>
										<div class="media-content">
											<p className="title is-size-4">${item.price}</p>
											<p className="subtitle is-size-5">{item.name}</p>
										</div>
									</article>

									<Button
										block
										color="danger"
										size="small"
										icon="shopping-cart"
										action={() => setItem(item.id)}
									>
										Select
									</Button>
								</div>
							))}
					</div>
				)}

				{item &&
				!confirm && (
					<div>
						<p className="title is-size-4-mobile">Choose your delivery</p>
						<Button
							outlined
							color="info"
							size="medium"
							block
							active={day === 'Today'}
							action={() => setDay('Today')}
						>
							Today
						</Button>
						<br />
						<Button
							outlined
							color="info"
							size="medium"
							block
							active={day === 'Tomorrow'}
							action={() => setDay('Tomorrow')}
						>
							Tomorrow
						</Button>
						<br />
						<div className="select is-medium is-fullwidth">
							<select value={deliveryDateTime} onChange={({ target }) => setDelivery(target.value)}>
								<option value={null}>Select delivery time</option>
								{slots.filter((slot) => slot.title === day).map(
									(slot) =>
										differenceInHours(slot.start, Date.now()) > 0 && (
											<option value={slot.start} key={slot.start}>
												{slot.slot}
											</option>
										)
								)}
							</select>
						</div>
						<br />
						<br />
						<Button
							block
							color="danger"
							size="medium"
							icon="check-circle"
							action={() => setConfirm(true)}
							disabled={!deliveryDateTime}
						>
							Continue
						</Button>
						<Button color="text" action={() => setItem(null)}>
							Back
						</Button>
					</div>
				)}

				{/* {item &&
			deliveryDateTime &&
			!payment && (
				<div>
					{console.log(item)}

					<p className="title is-size-4-mobile">Please enter your card</p>
					<Elements stripe={stripePromise}>
						<CheckoutForm item={items.find((inventory) => inventory.id === item)} setPayment={setPayment} />
					</Elements>
				</div>
			)} */}

				{confirm &&
				!finish && (
					<div>
						<p className="title">Order Confirmed</p>
						<p className="subtitle">Please check your text messages for the gift code!</p>
						<br />
						<p className="title is-size-5">
							{day}, {format(new Date(deliveryDateTime), 'MM/dd/yyyy hh a')}
						</p>
						<p className="subtitle is-size-5">{address}</p>

						<label className="checkbox">
							<input type="checkbox" onChange={() => setAccept(true)} />
							I agree with the Terms&amp;Conditions and Privacy Policy.
						</label>
						<br />
						<br />
						<Button
							block
							color="danger"
							size="medium"
							icon="check-circle"
							disabled={!accept}
							action={() => setFinish(true)}
						>
							Finish
						</Button>
					</div>
				)}
			</div>
		);

	return null;
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

const ITEMS = gql`
	query Items {
		items {
			id
			name
			price
			picture
		}
	}
`;

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
