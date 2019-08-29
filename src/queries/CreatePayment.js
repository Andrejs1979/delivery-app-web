import gql from "graphql-tag";

export default gql`
  mutation CreatePayment($paymentProps: PaymentProps) {
    createPayment(paymentProps: $paymentProps) {
      id
      amount
      currency
      status
      authCode
      responseCode
      retrievalRef
      responseText
      isLive
    }
  }
`;
