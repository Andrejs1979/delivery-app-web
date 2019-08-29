import gql from 'graphql-tag';

export default gql`
	mutation SkipNextRunSubscription($subscriptionID: ID!) {
		skipNextRunSubscription(subscriptionID: $subscriptionID) {
			id
			amount
			frequency
			status
		}
	}
`;
