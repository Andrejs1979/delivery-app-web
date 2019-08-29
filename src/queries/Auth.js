import gql from "graphql-tag";

export default gql`
  {
    auth {
      id
      email
      firstName
      lastName
      affiliateKey
      merchant {
        id
        key
        apiKey
        status
        isLive
        phone
      }
    }
  }
`;
