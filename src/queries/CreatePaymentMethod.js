import gql from "graphql-tag";

export default gql`
  mutation CreatePaymentMethod($paymentProps: PaymentProps) {
    createPaymentMethod(paymentProps: $paymentProps) {
      id
      token
      brand
      bin
      last4
      status
    }
  }
`;
