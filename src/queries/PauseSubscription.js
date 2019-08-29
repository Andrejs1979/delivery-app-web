import gql from 'graphql-tag';

export default gql`
	mutation PauseSubscription($subscriptionID: ID!) {
		pauseSubscription(subscriptionID: $subscriptionID) {
			id
			amount
			frequency
			status
		}
	}
`;
