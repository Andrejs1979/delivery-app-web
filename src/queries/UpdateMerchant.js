import gql from "graphql-tag";

export default gql`
  mutation UpdateMerchant($merchantProps: MerchantProps) {
    updateMerchant(merchantProps: $merchantProps) {
      id
    }
  }
`;
