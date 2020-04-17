import React, { useContext, useRef, useState, useEffect } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useModal } from 'react-modal-hook';

import MapGL, { GeolocateControl, Marker } from 'react-map-gl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
import { Box, Button, ButtonGroup, Columns, Column } from 'components/ui/bulma';
// import { Input } from 'components/ui/bulma';

const token = 'pk.eyJ1IjoiYW5kcmVqczE5NzkiLCJhIjoiY2s4ZXg3M3hxMDBtaDNkbjZwMGl1ZGNkMCJ9.lfRQSV9ls7UYOQgG4zJSSg';

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

const settings = {
	dots: true,
	infinite: true,
	speed: 500,
	slidesToShow: 1,
	slidesToScroll: 1
};

export default function Order({ address, phone, location, order, setOrder }) {
	const mapRef = useRef();
	const [ item, setItem ] = useState();
	const [ image, setImage ] = useState();
	const [ price, setPrice ] = useState();
	// const [ payment, setPayment ] = useState();
	const [ day, setDay ] = useState();
	const [ deliveryDateTime, setDelivery ] = useState();
	const [ accept, setAccept ] = useState();
	const [ confirm, setConfirm ] = useState();
	const [ finish, setFinish ] = useState();

	const { loading, data, error } = useQuery(ITEMS);
	const [ createOrder ] = useMutation(CREATE_ORDER);

	const [ showConfirmation, hideOrderForm ] = useModal(
		() => (
			<div className="modal is-active">
				{/* <div className="modal-background" /> */}
				<br />
				<br />
				<br />
				<div class="modal-card">
					<div className="box has-background-light">
						<div className="has-text-centered">
							<div style={{ height: '10vh' }}>
								<MapGL
									ref={mapRef}
									latitude={location.center[1]}
									longitude={location.center[0]}
									zoom={12}
									mapStyle="mapbox://styles/andrejs1979/ck8gin8zl09us1ioih7tkmcpi"
									width="100%"
									height="100%"
									// onViewportChange={_onViewportChange}
									mapboxApiAccessToken={token}
								>
									<Marker latitude={location.center[1]} longitude={location.center[0]}>
										<FontAwesomeIcon icon="map-marker-alt" size="2x" color="#FF3366" />
									</Marker>
								</MapGL>
							</div>
						</div>
						<br />
						<p className="title has-text-centered is-size-5-mobile">Confirmation</p>
						<p className="subtitle has-text-centered is-size-6">
							We'll text your gift code after confirmation.
						</p>

						<Columns mobile>
							<Column>
								{/* <p class="title is-6 has-text-centered">Where</p> */}
								<p class="title is-6">{address}</p>
							</Column>
							<Column>
								{/* <p class="title is-6  has-text-centered">When</p> */}
								<p className="title is-size-6">
									{day}, {format(new Date(deliveryDateTime), 'MM/dd/yyyy hh a')}
								</p>
							</Column>
						</Columns>
						<Box>
							{/* <p className="title is-5">Your order:</p> */}
							<p className="title is-6">
								Art print and delivery<span className="is-pulled-right">${price}</span>
							</p>
							<hr />
							<p className="title is-6">
								Total<span className="is-pulled-right">${price}</span>
							</p>
						</Box>
						<p className="has-text-centered">Pay by CASH on delivery</p>

						<Columns mobile vertical>
							<Column size="1">
								<label className="checkbox">
									<input
										type="checkbox"
										style={{ height: 20, width: 20, marginRight: 20 }}
										onChange={() => setAccept(true)}
										// onClick={() => console.log('click')}
									/>
								</label>
							</Column>

							<Column>
								<p className="is-size-7 has-text-left">
									I agree with the Terms&amp;Conditions and Privacy Policy.
								</p>
							</Column>
						</Columns>

						<Button
							block
							color="danger"
							size="medium"
							icon="check-circle"
							disabled={!accept || finish}
							action={() => setFinish(true)}
						>
							{!finish ? 'Confirm' : 'Thank you'}
						</Button>

						<p className="title is-size-7 has-text-centered">
							<br />
							<FontAwesomeIcon icon="phone-alt" />{' '}
							<a href="tel:2029219888" className="has-text-black">
								Need Help? Give us a call
							</a>
						</p>
					</div>
				</div>
				{/* <button class="modal-close is-large" aria-label="close" /> */}
			</div>
		),
		[ day, location, price, address, finish, deliveryDateTime, accept, setAccept, setFinish ]
	);

	useEffect(
		() => {
			if (confirm) showConfirmation();
		},
		[ confirm ]
	);

	useEffect(
		() => {
			if (finish && accept) {
				const orderProps = { address, phone, item, deliveryDateTime };

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
				const { image, price } = data.items.find((i) => i.id === item);
				setImage(image);
				setPrice(price);
			}
		},
		[ item, deliveryDateTime ]
	);

	return (
		<div>
			{data &&
			!item &&
			!deliveryDateTime &&
			!confirm && (
				<div>
					<div className="has-text-left">
						<FontAwesomeIcon
							icon="arrow-alt-circle-left"
							size="3x"
							color="#209cee"
							onClick={() => setOrder(false)}
						/>
					</div>
					<br />
					<div className="box has-background-light">
						<p className="title is-size-5">Choose your artwork</p>
						<div className="columns is-mobile">
							<div className="column has-text-centered">
								<Image
									publicId={`delivery/${data.items[0].picture}`}
									height="50"
									crop="scale"
									onClick={() => setItem(data.items[0].id)}
								/>

								<Button
									block
									size="small"
									color="danger"
									icon="shopping-cart"
									action={() => setItem(data.items[0].id)}
								>
									${data.items[0].price}
								</Button>
							</div>

							<div className="column has-text-centered">
								<Image
									publicId={`delivery/${data.items[1].picture}`}
									height="50"
									crop="scale"
									onClick={() => setItem(data.items[1].id)}
								/>

								<Button
									block
									size="small"
									color="danger"
									icon="shopping-cart"
									action={() => setItem(data.items[1].id)}
								>
									${data.items[1].price}
								</Button>
							</div>
						</div>

						<div className="columns is-mobile">
							<div className="column has-text-centered">
								<Image
									publicId={`delivery/${data.items[2].picture}`}
									height="50"
									crop="scale"
									onClick={() => setItem(data.items[2].id)}
								/>

								<Button
									block
									size="small"
									color="danger"
									icon="shopping-cart"
									action={() => setItem(data.items[2].id)}
								>
									${data.items[2].price}
								</Button>
							</div>
							<div className="column has-text-centered">
								<Image
									publicId={`delivery/${data.items[3].picture}`}
									height="50"
									crop="scale"
									onClick={() => setItem(data.items[3].id)}
								/>

								<Button
									block
									size="small"
									color="danger"
									icon="shopping-cart"
									action={() => setItem(data.items[3].id)}
								>
									${data.items[3].price}
								</Button>
							</div>
						</div>
					</div>
				</div>
			)}

			{item &&
			!confirm && (
				<div>
					<div className="has-text-left">
						<FontAwesomeIcon
							icon="arrow-alt-circle-left"
							size="3x"
							color="#209cee"
							onClick={() => setItem(false)}
						/>
					</div>
					<br />
					<div className="box has-background-light">
						<p className="title is-size-4-mobile">Book your delivery</p>
						<div class="buttons has-addons is-centered">
							<Button
								outlined={day !== 'Today'}
								color="info"
								active={day === 'Today'}
								action={() => setDay('Today')}
								disabled={
									!slots
										.filter((slot) => slot.title === day)
										.filter((slot) => differenceInHours(slot.start, Date.now()) < 3)
								}
							>
								Today
							</Button>
							<br />
							<Button
								outlined={day !== 'Tomorrow'}
								color="info"
								active={day === 'Tomorrow'}
								action={() => setDay('Tomorrow')}
							>
								Tomorrow
							</Button>
						</div>

						<div className="select is-medium is-fullwidth">
							<select value={deliveryDateTime} onChange={({ target }) => setDelivery(target.value)}>
								<option value={null}>Select delivery time</option>
								{slots.filter((slot) => slot.title === day).map(
									(slot) =>
										differenceInHours(slot.start, Date.now()) > 2 && (
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
					</div>
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

			{/* {confirm && (
				<div>
					<div className="has-text-left">
						<FontAwesomeIcon
							icon="arrow-alt-circle-left"
							size="3x"
							color={!finish ? '#209cee' : '#ccc'}
							onClick={() => !finish && setConfirm(false)}
						/>
					</div>
					<br />
					<div className="box has-background-light">
						<p className="title is-size-5-mobile">Confirmation</p>
						<p className="subtitle">Confirm your order and check your text messages for the gift code!</p>
						<br />
						<p className="title is-size-6">
							{day}, {format(new Date(deliveryDateTime), 'MM/dd/yyyy hh a')}
						</p>
						<p className="subtitle is-size-6">{address}</p>

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
							disabled={!accept || finish}
							action={() => setFinish(true)}
						>
							{!finish ? 'Confirm' : 'Thank you'}
						</Button>
					</div>
				</div>
			)} */}
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
