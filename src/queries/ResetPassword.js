import gql from "graphql-tag";

export default gql`
  mutation ResetPassword($userProps: UserProps) {
    resetPassword(userProps: $userProps) {
      id
    }
  }
`;
