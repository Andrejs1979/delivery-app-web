import gql from 'graphql-tag';

export default gql`
	mutation ResumeSubscription($subscriptionID: ID!) {
		resumeSubscription(subscriptionID: $subscriptionID) {
			id
			amount
			frequency
			status
		}
	}
`;
