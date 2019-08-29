import gql from 'graphql-tag';

export default gql`
	query CurrentUser($id: ID!) {
		merchants(id: $id) {
			id
			key
			apiKey
			status
			isLive
		}
	}
`;
