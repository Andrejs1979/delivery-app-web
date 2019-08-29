import gql from "graphql-tag";

export default gql`
  mutation CreateInvoice($invoiceProps: InvoiceProps) {
    createInvoice(invoiceProps: $invoiceProps) {
      id
      status
    }
  }
`;
