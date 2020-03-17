import React, { useContext, useRef, useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useModal } from 'react-modal-hook';

import { Box, Notification } from 'components/ui/bulma';

import CustomerForm from 'components/forms/CustomerForm';
// import PaymentForm from "components/forms/PaymentForm";

import Hero from 'components/ui/Hero';
import List from 'components/ui/List';
import Cards from 'components/ui/Cards';
import Spinner from 'components/ui/Spinner';
import Error from 'components/ui/Error';

// import brandIcon from "utils/brandIcon";
import formatDate from 'utils/formatDate';
// import setColor from "utils/setColor";
// import statusIcon from "utils/statusIcon";
import customerName from 'utils/customerName';

export default function Customer({ itemID }) {
	const componentRef = useRef();

	const [ tab, setTab ] = useState('overview');
	const [ view, setView ] = useState('large');
	const [ item, setItem ] = useState(itemID);

	const { data, loading, error } = useQuery(CUSTOMER_DETAILS, {
		variables: { id: item }
	});

	// const [archive, { loading: archiveLoading }] = useMutation(ARCHIVE, {
	//   variables: { id: item },
	//   context: { headers },
	//   refetchQueries: ["Account", "ConsumerDetails"]
	// });

	const [ showUpdateModal, hideUpdateModal ] = useModal(
		() => (
			<div className="modal is-active">
				<div className="modal-background" />
				<div className="modal-content">
					<CustomerForm item={data.consumer} onClose={hideUpdateModal} />
				</div>
			</div>
		),
		[ data ]
	);

	//   const [showSaveModal, hideSaveModal] = useModal(
	//     () => (
	//       <div className="modal is-active">
	//         <div className="modal-background" />
	//         <div className="modal-content">
	//           <PaymentForm save customer={data.consumer} onClose={hideSaveModal} />
	//         </div>
	//       </div>
	//     ),
	//     [data]
	//   );

	//   const [showPaymentModal, hidePaymentModal] = useModal(
	//     () => (
	//       <div className="modal is-active">
	//         <div className="modal-background" />
	//         <div className="modal-content">
	//           <PaymentForm customer={data.consumer} onClose={hidePaymentModal} />
	//         </div>
	//       </div>
	//     ),
	//     [data]
	//   );

	if (loading) return <Spinner />;
	if (error) return <Error error={error} />;

	const { consumer, consumer: { displayName, email, avatar, approvedCount, locationCount, paidTotal, posts } } = data;

	return (
		<div>
			<Hero item={item} color="light" avatar={avatar} title={displayName} subtitle={email} />
			<Profile tab={tab} actions={[ setItem ]} view={view} data={data} />
			<br />
			<Cards type="posts" data={posts} />
		</div>
	);
}

const Profile = ({ tab, view, actions: [ setItem ], data: { consumer } }) => {
	const { cards, payments, invoices, subscriptions } = consumer;

	switch (tab) {
		case 'overview':
			return (
				<div>
					<nav className="level">
						<div className="level-item has-text-centered">
							<div>
								<p className="heading">locations</p>
								<p className="title">{consumer.locationCount}</p>
							</div>
						</div>
						<div className="level-item has-text-centered">
							<div>
								<p className="heading">posts</p>
								<p className="title">{consumer.approvedCount}</p>
							</div>
						</div>
						<div className="level-item has-text-centered">
							<div>
								<p className="heading">total rewards</p>
								<p className="title">
									{consumer.paidTotal ? (
										<span>
											<small>$</small>
											{Number(consumer.paidTotal)}
										</span>
									) : (
										'0'
									)}
								</p>
							</div>
						</div>

						<div className="level-item has-text-centered">
							<div>
								<p className="heading">Latest post</p>
								<p className="title">
									{consumer.lastPost ? (
										<span>{formatDate(consumer.lastPost, 'date-year')}</span>
									) : (
										'-'
									)}
								</p>
							</div>
						</div>
					</nav>
				</div>
			);

		case 'transactions':
			return <List type="activity" view={view} data={payments} actions={[ setItem ]} />;
		case 'invoices':
			return <List type="invoices" view={view} data={invoices} actions={[ setItem ]} />;
		case 'scheduled':
			return <List type="scheduled payments" view={view} data={subscriptions} actions={[ setItem ]} />;
		// case "cards":
		//   return <Cards view={view} data={cards} />;

		default:
			return null;
	}
};

// const Cards = ({ data }) => {
//   if (!data || data.length < 1)
//     return (
//       <Notification color="dark">
//         <strong>{`No saved cards found. Please check back later!`}</strong>
//       </Notification>
//     );
//   return (
//     <div className="columns is-multiline is-mobile">
//       {data.map(({ id, brand, last4, status, expMM, expYY }) => {
//         if (brand)
//           return (
//             <div className="column is-narrow" key={id}>
//               <Box color="white-bis">
//                 <article className="media">
//                   <div className="media-left">
//                     <span className="icon is-large has-text-black">
//                       <i className={`fab fa-3x fa-${brandIcon(brand)}`} />
//                     </span>
//                   </div>
//                   <div className="media-content">
//                     <div className="content">
//                       <p className="title is-4">{last4}</p>
//                       <p className="subtitle is-6">
//                         {expMM}/{expYY}
//                       </p>
//                     </div>
//                   </div>
//                 </article>
//                 {/* <Toolbar itemID={id} buttons={buttons} color="primary" size="small" /> */}
//               </Box>
//             </div>
//           );
//       })}
//     </div>
//   );
// };

// *****************************************
// **************** GraphQL ****************
// *****************************************

const CUSTOMER_DETAILS = gql`
	query ConsumerDetails($id: ID!) {
		consumer(id: $id) {
			id
			email
			avatar
			displayName
			approvedCount
			locationCount
			paidTotal
			lastPost
			posts {
				id
				uri
			}
		}
	}
`;

// const ARCHIVE = gql`
//   mutation ArchiveCustomer($id: ID!) {
//     archiveConsumer(id: $id) {
//       id
//     }
//   }
// `;
