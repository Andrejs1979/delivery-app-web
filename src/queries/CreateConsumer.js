import gql from "graphql-tag";

export default gql`
  mutation CreateConsumer($consumerProps: ConsumerProps) {
    createConsumer(consumerProps: $consumerProps) {
      id
      email
    }
  }
`;
