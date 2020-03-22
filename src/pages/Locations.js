import React, { useContext, useState } from "react";

import { gql, useQuery } from "@apollo/client";

import Hero from "components/ui/Hero";
import List from "components/ui/List";

import Cards from "components/ui/Cards";
import Error from "components/ui/Error";
import Spinner from "components/ui/Spinner";
//import { Section } from 'components/ui/bulma';

import UserContext from "context/UserContext";

export default function Locations({ itemID }) {
  const { headers } = useContext(UserContext);

  const [tab, setTab] = useState("active");
  const [view, setView] = useState("large");
  const [item, setItem] = useState(itemID);

  const { loading, data, error } = useQuery(LOCATIONS, {
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
        title="Locations"
        subtitle="Your restaurant locations"
        // tabs={tabs}
        // activeTab={tab}
        setTab={setTab}
        view={view}
        setView={setView}
      />
      {/* <List
        type="customers"
        view={view}
        data={data.consumers}
        actions={[setItem]}
      /> */}
      <Cards type="locations" data={data.locations} />
    </div>
  );
}

// { "campaignID": "5cdb2c9f6ac4730411eb29ba" }

const LOCATIONS = gql`
  query Locations($campaignID: ID) {
    locations(campaignID: $campaignID) {
      id
      name
      category
      address
      city
      state
      zip
      country
      active
      verified
      campaigns {
        id
      }
      assets {
        id
        logoURI
        defaultPictureURI
      }
    }
  }
`;
