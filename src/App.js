import "./App.sass";
import React from "react";

import analytics from "react-segment";

import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";

import { useAuthState } from "react-firebase-hooks/auth";
import { firebaseAppAuth } from "services/firebase";

import Auth from "components/pages/AuthPage";
import Account from "components/Account";

import Error from "components/ui/Error";
import Spinner from "components/ui/Spinner";

analytics.default.load(process.env.REACT_APP_SEGMENT_KEY);

const client = new ApolloClient({
  uri: process.env.REACT_APP_API_ROOT_URL
});

export default function App() {
  const [user, loading, error] = useAuthState(firebaseAppAuth);

  if (loading) return <Spinner />;
  if (error) return <Error error={error} />;

  console.log(user.uid);

  return (
    <ApolloProvider client={client}>
      {user ? <Account /> : <Auth />}
    </ApolloProvider>
  );
}
