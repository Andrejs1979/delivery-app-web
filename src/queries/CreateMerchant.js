import gql from 'graphql-tag';

export default gql`
	mutation CreateMerchant($merchantProps: MerchantProps, $user: String!) {
		createMerchant(merchantProps: $merchantProps, user: $user) {
			id
			status
		}
	}
`;
