import React, { useContext, useState, useEffect } from 'react';

import { gql, useMutation } from '@apollo/client';

import { Formik, Form, Field } from 'formik';

import { Hero } from 'components/ui/bulma';
import { Box, Button, ButtonGroup } from 'components/ui/bulma';
import { Input } from 'components/ui/bulma';

import UserContext from 'context/UserContext';

const items = [
	{
		id: '5e84813c1c9d440000a35281',
		title: 'Small Poster',
		image: 'https://res.cloudinary.com/fastlabs/image/upload/v1585745990/deliverySlot/poster40_y29kdb.jpg',
		price: '$40'
	},
	{
		id: '5e848cdd1c9d440000a35282',
		title: 'Medium Poster',
		image: 'https://res.cloudinary.com/fastlabs/image/upload/v1585745990/deliverySlot/poster60_q1rlkb.jpg',
		price: '$60'
	},
	{
		id: '5e848cef1c9d440000a35283',
		title: 'Large Poster',
		image: 'https://res.cloudinary.com/fastlabs/image/upload/v1585745989/deliverySlot/poster70_fkayov.jpg',
		price: '$70'
	}
];
const slots = [
	{ id: '1', title: 'Morning', slot: '9am - 12pm' },
	{ id: '2', title: 'Midday', slot: '12am - 3pm' },
	{ id: '3', title: 'Afternoon', slot: '3pm - 6pm' },
	{ id: '4', title: 'Evening', slot: '6am - 9pm' }
];

export default function Order({ address, onClose }) {
	const [ item, setItem ] = useState();
	const [ image, setImage ] = useState();
	const [ deliverySlot, setDelivery ] = useState();
	const [ finish, setFinish ] = useState();

	const [ createOrder ] = useMutation(CREATE_ORDER);

	useEffect(
		() => {
			if (finish) {
				console.log(address, item, deliverySlot, finish);

				const orderProps = { address, item, deliverySlot };

				try {
					createOrder({ variables: { orderProps } });
					onClose();
				} catch (error) {
					console.log(error);
				}
			}
		},
		[ item, deliverySlot, address, finish ]
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
					<div className="column">
						<Box>
							<h1 className="title">Choose your artwork</h1>
							<div className="tile is-ancestor">
								{items.map((item) => (
									<div className="tile is-parent" key={item.id}>
										<div className="tile is-child box">
											<span className="icon is-large">
												<i className="fas fa-3x fa-store" />
											</span>

											<img src={item.image} />
											<p className="title">{item.title}</p>
											<p className="subtitle">{item.price}</p>
											<Button size="medium" icon="check-circle" action={() => setItem(item.id)}>
												Order now
											</Button>
										</div>
									</div>
								))}
							</div>
						</Box>
					</div>
				)}

				{item &&
				!deliverySlot && (
					<div className="column">
						<Box>
							<h1 className="title">Select your delivery slot</h1>
							<div className="tile is-ancestor">
								{slots.map((slot) => (
									<div className="tile is-parent" key={slot.id}>
										<div className="tile is-child box">
											<span className="icon is-large">
												<i className="fas fa-3x fa-store" />
											</span>

											<p className="title">{slot.title}</p>
											<p className="subtitle">{slot.slot}</p>
											<Button
												size="medium"
												icon="check-circle"
												action={() => setDelivery(slot.id)}
											>
												Book delivery
											</Button>
										</div>
									</div>
								))}
							</div>
						</Box>
					</div>
				)}

				{item &&
				deliverySlot && (
					<div className="column is-half-desktop">
						<Box>
							<h1 className="title">Confirmation</h1>
							<div className="tile is-ancestor">
								<div className="tile is-parent">
									<div className="tile is-child box">
										<span className="icon is-large">
											<i className="fas fa-3x fa-store" />
										</span>
										<figure className="image is-256x256">
											<img src={image} />
										</figure>
										<p className="title">Thank you!</p>
										<p className="subtitle">
											Your item will be delivered at {address} between {slots[deliverySlot].slot}.
										</p>
										<Button size="medium" icon="check-circle" action={() => setFinish(true)}>
											Finish
										</Button>
									</div>
								</div>
							</div>
						</Box>
					</div>
				)}
			</div>
		</Hero>
	);
}

const CREATE_ORDER = gql`
	mutation CreateOrder($orderProps: OrderProps) {
		createOrder(orderProps: $orderProps) {
			id
		}
	}
`;
