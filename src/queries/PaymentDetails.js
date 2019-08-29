import gql from "graphql-tag";

export default gql`
  query PaymentDetails($id: ID!) {
    payment(id: $id) {
      id
      date
      status
      isLive
      amount
      currency
      authCode
      consumer {
        id
        firstName
        lastName
        email
        phone
      }
      card {
        id
        brand
        last4
      }
    }
  }
`;
