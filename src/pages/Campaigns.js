import React, { useContext } from "react";

import { gql, useQuery } from "@apollo/client";

import Cards from "components/ui/Cards";
import Error from "components/ui/Error";
import Spinner from "components/ui/Spinner";

import UserContext from "context/UserContext";

const CAMPAIGNS = gql`
  query Campaigns {
    campaigns {
      id
      name
      status
      ads {
        id
      }
    }
  }
`;

export default function Campaigns() {
  const { headers } = useContext(UserContext);

  const { loading, data, error } = useQuery(CAMPAIGNS, {
    context: { headers }
  });

  if (loading) return <Spinner />;
  if (error) return <Error error={error} />;

  return <Cards type="campaigns" data={data.campaigns} />;
}
