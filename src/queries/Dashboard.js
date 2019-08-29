import gql from 'graphql-tag';

export default gql`
	query Dashboard($id: ID!) {
		merchant(id: $id) {
			id
			key
			paymentCount
			consumerCount
			orderCount
			approvedCount
			declinedCount
			flaggedCount
			consumers {
				id
				firstName
				lastName
				email
			}
			orders {
				id
			}
			invoices {
				id
				status
				amount
				currency
				dueDate
				description
				allowInstallments
			}
			payments {
				id
				date
				amount
				currency
				status
				isLive
				consumer {
					id
					firstName
					lastName
					email
				}
				card {
					id
					brand
					last4
				}
			}
		}
	}
`;
