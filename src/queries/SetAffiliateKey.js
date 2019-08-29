import gql from "graphql-tag";

export default gql`
  mutation SetAffiliateKey($userProps: UserProps) {
    setAffiliateKey(userProps: $userProps) {
      id
    }
  }
`;
