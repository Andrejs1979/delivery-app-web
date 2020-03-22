import React, { useState } from "react";

import { gql, useQuery } from "@apollo/client";

import Hero from "components/ui/Hero";
import List from "components/ui/List";
import Customer from "components/profiles/Customer";

import Cards from "components/ui/Cards";
import Error from "components/ui/Error";
import Spinner from "components/ui/Spinner";

export default function Consumers({ itemID }) {
  const [tab, setTab] = useState("active");
  const [view, setView] = useState("large");
  const [item, setItem] = useState(itemID);
  const { loading, data, error } = useQuery(CONSUMERS, {
    // variables: { email: user.email },
  });

  if (loading) return <Spinner />;
  if (error) return <Error error={error} />;

  if (item) return <Customer id={item} />;

  return (
    <div>
      <Hero
        color="primary"
        icon="user-friends"
        title="Customers"
        subtitle="All you need to know about your customers"
        // tabs={tabs}
        // activeTab={tab}
        setTab={setTab}
        view={view}
        setView={setView}
      />
      <List
        type="customers"
        view={view}
        data={data.consumers}
        actions={[setItem]}
      />
    </div>
  );
}

const tabs = [
  { title: "active", icon: "cart-arrow-down" },
  { title: "dormant", icon: "bed" },
  { title: "archived", icon: "archive" }
];

const CONSUMERS = gql`
  query Consumers {
    consumers {
      id
      email
      avatar
      displayName
      postCount
    }
  }
`;

// *****************************************
// **************** GraphQL ****************
// *****************************************

// const CUSTOMERS = gql`
// 	query Customers($status: String) {
// 		consumers(status: $status) {
// 			id
// 			status
// 			firstName
// 			lastName
// 			avatar
// 			email
// 			phone
// 			address
// 			status
// 			totalVolume
// 			transactions
// 			avgTransaction
// 			latestTransaction
// 		}
// 	}
// `;
