import "./App.sass";
import React from "react";

import analytics from "react-segment";

import {
  ApolloProvider,
  ApolloClient,
  HttpLink,
  InMemoryCache
} from "@apollo/client";

import { useAuthState } from "react-firebase-hooks/auth";
import { firebaseAppAuth } from "services/firebase";

import Auth from "components/pages/AuthPage";
import Account from "components/Account";

import Error from "components/ui/Error";
import Spinner from "components/ui/Spinner";

analytics.default.load(process.env.REACT_APP_SEGMENT_KEY);

const DEV =
  "https://csav5txhq2.execute-api.us-east-1.amazonaws.com/dev/graphql";

export default function App() {
  const [user, loading, error] = useAuthState(firebaseAppAuth);

  if (loading) return <Spinner />;
  if (error) return <Error error={error} />;

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      headers: {
        authorization: user ? user.uid : null
      },
      uri: process.env.REACT_APP_API_ROOT_URL
      // uri: DEV
      // uri: "https://9o07qpvqn6.execute-api.us-east-1.amazonaws.com/prod/graphql"
    })
  });

  return (
    <ApolloProvider client={client}>
      {user ? <Account /> : <Auth />}
    </ApolloProvider>
  );
}
