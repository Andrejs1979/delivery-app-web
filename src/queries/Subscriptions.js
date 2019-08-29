import gql from 'graphql-tag';

export default gql`
	query Subscriptions($id: ID!) {
		merchant(id: $id) {
			id
			subscriptions {
				id
				amount
				status
				startDate
				currency
				frequency
				lastRun
				nextRun
				payments {
					id
					status
					date
					card {
						id
						brand
						last4
					}
				}
				consumer {
					id
					email
					firstName
					lastName
				}
			}
		}
	}
`;
