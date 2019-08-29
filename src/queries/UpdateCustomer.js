import gql from "graphql-tag";

export default gql`
  mutation UpdateCustomer($consumerProps: ConsumerProps) {
    updateConsumer(consumerProps: $consumerProps) {
      id
      firstName
      lastName
      email
      phone
      address
    }
  }
`;
