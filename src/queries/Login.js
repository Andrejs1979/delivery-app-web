import gql from "graphql-tag";

export default gql`
  mutation Login($userProps: UserProps) {
    login(userProps: $userProps) {
      id
    }
  }
`;
