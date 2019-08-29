import gql from "graphql-tag";

export default gql`
  query Invoices($id: ID!) {
    merchant(id: $id) {
      id
      invoices {
        id
        status
        amount
        currency
        dueDate
        description
        allowInstallments
      }
    }
  }
`;
