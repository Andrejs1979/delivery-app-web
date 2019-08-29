import gql from "graphql-tag";

export default gql`
  query ConsumerSearch($query: String!) {
    consumerSearch(query: $query) {
      id
      firstName
      lastName
      email
      phone
    }
  }
`;
