import gql from "graphql-tag";

export default gql`
  mutation UpdateSubscription($subscriptionProps: SubscriptionProps) {
    updateSubscription(subscriptionProps: $subscriptionProps) {
      id
      status
    }
  }
`;
