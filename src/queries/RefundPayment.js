import gql from "graphql-tag";

export default gql`
  mutation RefundPayment($refundProps: RefundProps) {
    refundPayment(refundProps: $refundProps) {
      id
      amount
    }
  }
`;
