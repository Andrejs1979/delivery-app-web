import gql from 'graphql-tag';

export default gql`
	mutation ChargeSubscription($subscriptionID: ID!) {
		chargeSubscription(subscriptionID: $subscriptionID) {
			id
			amount
			frequency
			status
		}
	}
`;
