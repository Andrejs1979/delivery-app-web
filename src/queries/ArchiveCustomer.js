import gql from "graphql-tag";

export default gql`
  mutation ArchiveCustomer($consumerProps: ConsumerProps) {
    archiveCustomer(consumerProps: $consumerProps) {
      id
    }
  }
`;
