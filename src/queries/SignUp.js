import gql from "graphql-tag";

export default gql`
  mutation SignUp($userProps: UserProps) {
    signup(userProps: $userProps) {
      id
    }
  }
`;
