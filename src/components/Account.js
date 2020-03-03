import React, { useEffect } from "react";

import { gql, useQuery } from "@apollo/client";

import { Router } from "@reach/router";

import { useAuthState } from "react-firebase-hooks/auth";
import { firebaseAppAuth } from "services/firebase";

import { ModalProvider } from "react-modal-hook";
import { CloudinaryContext } from "cloudinary-react";

import Layout from "components/ui/Layout";
import Spinner from "components/ui/Spinner";

import Welcome from "components/pages/Welcome";
import Dashboard from "components/pages/Dashboard";
import Campaigns from "components/pages/Campaigns";
import Consumers from "components/pages/Consumers";
import Posts from "components/pages/Posts";
import Locations from "components/pages/Locations";
import Ads from "components/pages/Ads";
import Transactions from "components/pages/Transactions";

import UserContext from "context/UserContext";

export default function Account() {
  const [user] = useAuthState(firebaseAppAuth);

  const { loading, data, error } = useQuery(CURRENT_USER, {
    variables: { email: user.email }
  });

  useEffect(() => {
    if (user && data && data.accounts[0])
      window.analytics.identify(user.uid, {
        name: user.displayName,
        email: user.email,
        company: {
          id: data.accounts[0].id,
          name: data.accounts[0].name
        },
        createdAt: user.metadata.creationTime
      });

    // window.analytics.page('account');
  }, [user, data]);

  if (loading) return <Spinner />;
  if (error) return <div>{error}</div>;

  const [account] = data.accounts;

  return (
    <UserContext.Provider value={{ user, account }}>
      <CloudinaryContext cloudName="hqsczucpx">
        <ModalProvider>
          <Router>
            {account.campaigns.length < 1 ? (
              <Welcome path="/" />
            ) : (
              <Layout path="/">
                <Dashboard path="/" />
                <Campaigns path="/campaigns" />
                <Consumers path="/consumers" />
                <Posts path="/posts" />
                <Locations path="/locations" />
                <Ads path="/ads" />
                <Transactions path="/transactions" />
              </Layout>
            )}
          </Router>
        </ModalProvider>

        {/* {process.env.NODE_ENV === 'production' && (
				<Drift appId="1034943" userId="1234" attributes={{ email: 'user@example.com', company: 'Acme Inc' }} />
			)} */}
      </CloudinaryContext>
    </UserContext.Provider>
  );
}

const CURRENT_USER = gql`
  query CurrentUser($email: String) {
    accounts(email: $email) {
      id
      name
      apiKey
      status
      isLive
      campaigns {
        id
      }
    }
  }
`;
