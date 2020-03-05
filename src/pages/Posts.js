import React from "react";

import { gql, useQuery, useMutation } from "@apollo/client";

import Cards from "components/ui/Cards";
import Error from "components/ui/Error";
import Spinner from "components/ui/Spinner";

export default function Campaigns() {
  const [approvePost] = useMutation(APPROVE_POST, {
    refetchQueries: ["Posts"]
  });

  const [declinePost] = useMutation(DECLINE_POST, {
    refetchQueries: ["Posts"]
  });

  const { loading, data, error } = useQuery(POSTS, {
    variables: { status: "approved", limit: 100 }
  });

  if (loading) return <Spinner />;
  if (error) return <Error error={error} />;

  return (
    <Cards
      type="posts"
      data={data.posts}
      //   actions={[approvePost, declinePost]}
    />
  );
}

const POSTS = gql`
  query Posts($limit: Int, $status: PostStatus) {
    posts(limit: $limit, status: $status) {
      id
      date
      status
      uri
      location {
        id
      }
      ad {
        id
        creativeURI
      }
      campaign {
        id
      }
      consumer {
        id
        avatar
        displayName
      }
    }
  }
`;

const APPROVE_POST = gql`
  mutation ApprovePost($postID: ID!) {
    approvePost(postID: $postID) {
      id
    }
  }
`;

const DECLINE_POST = gql`
  mutation DeclinePost($postID: ID!, $statusText: String!) {
    declinePost(postID: $postID, statusText: $statusText) {
      id
    }
  }
`;
