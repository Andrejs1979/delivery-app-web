import gql from 'graphql-tag';

export default gql`
	mutation CancelSubscription($subscriptionID: ID!) {
		cancelSubscription(subscriptionID: $subscriptionID) {
			id
			amount
			frequency
			status
		}
	}
`;
