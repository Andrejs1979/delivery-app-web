import gql from "graphql-tag";

export default gql`
  query Consumers($id: ID!) {
    merchant(id: $id) {
      id
      consumers {
        id
        firstName
        lastName
        email
        phone
        address
        status
      }
    }
  }
`;
