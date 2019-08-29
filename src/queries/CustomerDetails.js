import gql from 'graphql-tag';

export default gql`
	query ConsumerDetails($id: ID!) {
		consumer(id: $id) {
			id
			email
			firstName
			lastName
			phone
			address
			payments {
				id
				date
				amount
				currency
				status
				card {
					id
					brand
					last4
				}
			}
			invoices {
				id
				amount
				dueDate
				description
			}
			subscriptions {
				id
				amount
				status
				startDate
				currency
				frequency
				lastRun
				nextRun
				consumer {
					id
					email
					firstName
					lastName
				}
			}
			cards {
				id
				brand
				last4
			}
			merchants {
				id
			}
		}
	}
`;
