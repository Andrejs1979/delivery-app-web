import gql from "graphql-tag";

export default gql`
  query Payments($id: ID!) {
    merchant(id: $id) {
      id
      key
      payments {
        id
        date
        amount
        currency
        status
        authCode
        responseCode
        retrievalRef
        responseText
        isLive
        consumer {
          id
          firstName
          lastName
          email
        }
        card {
          id
          brand
          last4
        }
      }
    }
  }
`;
