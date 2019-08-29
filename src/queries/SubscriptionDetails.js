import gql from 'graphql-tag';

export default gql`
	query SubscriptionDetails($id: ID!) {
		subscription(id: $id) {
			id
			description
			status
			frequency
			startDate
			amount
			currency
			nextRun
			lastRun
			consumer {
				id
				email
				firstName
				lastName
			}
			payments {
				id
				date
				amount
				currency
				reference
				status
				card {
					id
					brand
					last4
				}
			}
		}
	}
`;
