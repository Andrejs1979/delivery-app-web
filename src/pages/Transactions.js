import React, { useContext, useState } from "react";

import { gql, useQuery } from "@apollo/client";

// import { Container } from 'components/ui/bulma';
// import { Content } from 'components/ui/bulma';
import Hero from "components/ui/Hero";
import Cards from "components/ui/Cards";
import Error from "components/ui/Error";
import Spinner from "components/ui/Spinner";

import UserContext from "context/UserContext";

const CONSUMERS = gql`
  query Consumers {
    consumers {
      id
      email
      avatar
      firstName
      lastName
      postCount
    }
  }
`;

export default function Transactions({ itemID }) {
  const { headers } = useContext(UserContext);

  const [tab, setTab] = useState("active");
  const [view, setView] = useState("large");
  const [item, setItem] = useState(itemID);

  const { loading, data, error } = useQuery(CONSUMERS, {
    // variables: { email: user.email },
    context: { headers }
  });

  if (loading) return <Spinner />;
  if (error) return <Error error={error} />;

  return (
    <div>
      <Hero
        color="primary"
        icon="store"
        title="Payments"
        subtitle="Your payments"
        // tabs={tabs}
        // activeTab={tab}
        setTab={setTab}
        view={view}
        setView={setView}
      />
      <Cards type="consumers" data={data.consumers} />
    </div>
  );
}
