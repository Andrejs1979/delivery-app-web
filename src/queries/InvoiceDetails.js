import gql from 'graphql-tag';

export default gql`
	query InvoiceDetails($id: ID!) {
		invoice(id: $id) {
			id
			allowInstallments
			items {
				id
				item
				qty
				price
				description
			}
			consumer {
				id
				firstName
				lastName
				email
				phone
			}
			payments {
				id
				date
				amount
				currency
				reference
				status
				card {
					id
					brand
					last4
				}
			}
			description
			status
			total
			tax
			taxRate
			amount
			dueDate
		}
	}
`;
