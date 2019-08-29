import gql from 'graphql-tag';

export default gql`
  mutation ActivateMerchant($merchantProps: MerchantProps) {
    activateMerchant(merchantProps: $merchantProps) {
      id
      status
    }
  }
`;
