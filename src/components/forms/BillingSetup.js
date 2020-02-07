import React, { useContext, useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import useScript from "@charlietango/use-script";

import {
  StripeProvider,
  Elements,
  CardElement,
  injectStripe
} from "react-stripe-elements";

import Modal from "components/ui/Modal";
import { Box, Button, Icon } from "components/ui/bulma/elements";
import { Columns, Column } from "components/ui/bulma";
import { Left, Level, Item } from "components/ui/bulma/layout";

import UserContext from "context/UserContext";

const STRIPE = "https://js.stripe.com/v3/";

export default function BillingSetup({ onClose }) {
  const [ready] = useScript(STRIPE);

  if (ready)
    return (
      <Modal icon="magic" title="Setup your billing" onClose={onClose}>
        <Columns>
          <Column>
            <Box>
              <p className="title is-4">Please enter your card details</p>
              <p className="subtitle">
                We will take a refundable $100 deposit and setup an automatic
                billing for the future.
              </p>
              <br />
              <Level mobile>
                <Left>
                  <Item>
                    <Icon
                      brand
                      name="cc-visa"
                      container="medium"
                      size="2x"
                      color="dark"
                    />
                  </Item>

                  <Item>
                    <Icon
                      brand
                      name="cc-mastercard"
                      container="medium"
                      size="2x"
                      color="dark"
                    />
                  </Item>

                  <Item>
                    <Icon
                      brand
                      name="cc-amex"
                      container="medium"
                      size="2x"
                      color="dark"
                    />
                  </Item>

                  <Item>
                    <Icon
                      brand
                      name="cc-discover"
                      container="medium"
                      size="2x"
                      color="dark"
                    />
                  </Item>
                </Left>
              </Level>
              <br />
              <StripeProvider apiKey="pk_live_B2FsiYxmA4o1cuvUVrctbOre009yyl1NlF">
                <Elements>
                  <PaymentForm />
                </Elements>
              </StripeProvider>
              <br />
              <Icon name="shield-alt" container="medium" size="sm" />
              Your card info is secure
            </Box>
          </Column>
          <Column>
            <article className="message is-dark is-small">
              <div className="message-body">
                <div className="content">
                  <h5 className="title is-4">How our billing works</h5>

                  <ul className="is-size-6">
                    <li>
                      <strong>Account balance.</strong> Your account has a cash
                      balance, which is used to pay rewards to your promoters.
                      The balance and transactions are available on the
                      dashboard in real-time.
                    </li>
                    <li>
                      <strong>Spending Limits.</strong> Your campaign is running
                      as long as your balance is positive, but it pauses
                      automatically once your spending limit is reached. You can
                      change this limit at any time.
                    </li>

                    <li>
                      <strong>Automatic charges.</strong> You give us your
                      permission to automatically top up your account balance
                      from your card when required, according to your spending
                      limits.
                    </li>
                    <li>
                      <strong>Risk free.</strong> The unused balance on your
                      account can be refunded at your request at any time, no
                      questions asked.
                    </li>
                  </ul>
                </div>
              </div>
            </article>
          </Column>
        </Columns>
      </Modal>
    );

  return null;
}

const _PaymentForm = ({ stripe }) => {
  const { headers } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState();
  const [error, setError] = useState();

  const [createCard] = useMutation(CREATE_CARD, {
    context: { headers },
    refetchQueries: ["CurrentUser", "Account"]
  });

  const tokenize = async () => {
    setLoading(true);
    const { token, error } = await stripe.createToken();
    if (error) setError(error);
    if (token) {
      setToken(token);

      const {
        id: providerID,
        name: providerName,
        brand,
        last4,
        funding,
        exp_month,
        exp_year,
        country,
        address_line1,
        address_city,
        address_state,
        address_zip,
        address_country
      } = token.card;

      const cardProps = {
        provider: "stripe",
        providerID,
        providerName,
        token: token.id,

        billingAddress: address_line1,
        billingCity: address_city,
        billingState: address_state,
        billingZip: address_zip,
        billingCountry: address_country,

        brand,
        last4,
        expMM: exp_month,
        expYYYY: exp_year,
        type: funding,
        method: token.object,
        country
      };

      await createCard({ variables: { cardProps } });
    }
    setLoading(false);
  };

  return (
    <div className="checkout">
      <CardElement
        style={{
          base: {
            fontSize: "20px"
          },
          invalid: {
            color: "#c23d4b"
          }
        }}
      />
      {!error && <p className="help is-danger">{error}</p>}
      <hr />
      {!token ? (
        <Button
          color={!loading && error ? "danger" : "primary"}
          size="medium"
          icon="credit-card"
          action={() => tokenize()}
          loading={loading}
        >
          Setup billing
        </Button>
      ) : (
        <Button
          color="success"
          size="medium"
          icon="check-circle"
          action={() => tokenize()}
          loading={loading}
          disabled
        >
          Thank you
        </Button>
      )}
    </div>
  );
};

const PaymentForm = injectStripe(_PaymentForm);

const CREATE_CARD = gql`
  mutation CreateCard($cardProps: CardProps) {
    createCard(cardProps: $cardProps) {
      id
    }
  }
`;
