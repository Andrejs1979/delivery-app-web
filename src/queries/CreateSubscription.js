import gql from "graphql-tag";

export default gql`
  mutation CreateSubscription($subscriptionProps: SubscriptionProps) {
    createSubscription(subscriptionProps: $subscriptionProps) {
      id
      status
    }
  }
`;
