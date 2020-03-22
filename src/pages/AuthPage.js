import React, { useState } from "react";

import { firebaseAppAuth } from "services/firebase";

import { Formik, Form, Field } from "formik";
import { Image, Transformation } from "cloudinary-react";

import { Columns, Column, Container } from "components/ui/bulma";
import { Box, Button, Notification } from "components/ui/bulma";
import { Input } from "components/ui/bulma";

import logo from "assets/mark-logo.png";

export default function AuthPage() {
  const [isLogin, toggleLogin] = useState(false);
  const [isReset, toggleReset] = useState(false);

  return (
    <section className="hero is-fullheight">
      <div className="hero-body">
        <Container>
          <Columns centered>
            <Column size="half">
              <Box>
                {isReset ? <Reset /> : isLogin ? <Login /> : <SignUp />}
                <br />
                {isReset || (
                  <Button color="text" action={() => toggleLogin(!isLogin)}>
                    <strong>
                      {isLogin
                        ? "No account? Sign up"
                        : "Have an account? Sign in"}{" "}
                    </strong>
                  </Button>
                )}
                <Button color="text" action={() => toggleReset(!isReset)}>
                  <strong>{isReset ? "Back" : "Reset password"}</strong>
                </Button>
              </Box>
            </Column>
          </Columns>
        </Container>
      </div>
    </section>
  );
}

const validate = values => {
  let errors = {};

  if (!values.email) {
    errors.email = "Please enter your email!";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,5}$/i.test(values.email))
    errors.email = "This email address is invalid";

  if (!values.password) {
    errors.password = "Password is required!";
  } else if (values.password.length < 8) {
    errors.password = "Password should be longer!";
  }

  return errors;
};

const handleAuth = async (values, { setSubmitting, setStatus, setErrors }) => {
  setSubmitting(true);

  try {
    await firebaseAppAuth.createUserWithEmailAndPassword(
      values.email,
      values.password
    );
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      try {
        await firebaseAppAuth.signInWithEmailAndPassword(
          values.email,
          values.password
        );
      } catch (error) {
        setStatus(error.message);
      }
    } else {
      setStatus(error.message);
    }
  }

  setSubmitting(false);
};

const SignUp = () => (
  <Formik
    initialValues={{
      email: "",
      password: ""
    }}
    validate={validate}
    onSubmit={handleAuth}
  >
    {({
      status,
      isSubmitting,
      handleSubmit,
      handleChange,
      handleBlur,
      values,
      touched,
      errors
    }) => (
      <Form>
        <Field
          name="email"
          size="medium"
          label="Business email"
          icon="at"
          component={Input}
          placeholder="Email"
          autoComplete="username"
        />

        <Field
          name="password"
          size="medium"
          type="password"
          label="Set your password"
          icon="lock"
          component={Input}
          placeholder="Password"
          autoComplete="current-password"
        />

        {status && <Notification>{status}</Notification>}
        <Button
          full
          size="medium"
          type="submit"
          color="primary"
          icon="check-circle"
        >
          Create Account
        </Button>
      </Form>
    )}
  </Formik>
);

const Login = () => (
  <Formik
    initialValues={{
      email: "",
      password: ""
    }}
    validate={validate}
    onSubmit={handleAuth}
  >
    {({
      status,
      isSubmitting,
      handleSubmit,
      handleChange,
      handleBlur,
      values,
      touched,
      errors
    }) => (
      <Form>
        <Field
          label="Email"
          size="medium"
          name="email"
          icon="at"
          component={Input}
          placeholder="Email"
          autoComplete="username"
        />

        <Field
          label="Password"
          size="medium"
          name="password"
          type="password"
          icon="lock"
          component={Input}
          placeholder="Password"
          autoComplete="current-password"
        />

        {status && <Notification color="danger">{status}</Notification>}

        <Button
          full
          type="submit"
          size="medium"
          color="primary"
          icon="check-circle"
        >
          Sign In
        </Button>
      </Form>
    )}
  </Formik>
);

const Reset = () => (
  <Formik
    initialValues={{
      email: ""
    }}
    validate={values => {
      let errors = {};

      if (!values.email) {
        errors.email = "Please enter your email!";
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,5}$/i.test(values.email)
      )
        errors.email = "This email address is invalid";

      return errors;
    }}
    onSubmit={(values, { setSubmitting, setStatus }) => {
      try {
        firebaseAppAuth
          .sendPasswordResetEmail(values.email)
          .then(() => setStatus("Please check your email for the next steps."));
      } catch (error) {
        setStatus(error.message);
      }

      setSubmitting(false);
    }}
  >
    {({
      status,
      isSubmitting,
      handleSubmit,
      handleChange,
      handleBlur,
      values,
      touched,
      errors
    }) => (
      <Form>
        <Field
          name="email"
          size="medium"
          label="Account Email"
          icon="at"
          component={Input}
          placeholder="Email"
          autoComplete="username"
        />

        {status && <Notification>{status}</Notification>}
        <Button
          full
          type="submit"
          size="medium"
          color="danger"
          icon="envelope"
          disabled={isSubmitting}
        >
          Reset Password
        </Button>
      </Form>
    )}
  </Formik>
);
