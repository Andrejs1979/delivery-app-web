import gql from 'graphql-tag';

export default gql`
	mutation ChargeInvoice($invoiceID: ID!) {
		chargeInvoice(invoiceID: $invoiceID) {
			id
			amount
			status
		}
	}
`;
