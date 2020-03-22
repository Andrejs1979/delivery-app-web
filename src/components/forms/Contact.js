import React, { useEffect } from "react";

import { FastField, useFormikContext } from "formik";

import { Box, Input } from "components/ui/bulma";

export default function Brand() {
  const { values, setFieldValue, setFieldTouched } = useFormikContext();

  useEffect(() => {
    setFieldValue("hashtag", values.name.replace(/\s/g, ""));
  }, [setFieldTouched, setFieldValue, values.name]);

  return (
    <Box>
      <FastField
        name="name"
        size="medium"
        label="Full Name"
        icon="user-tie"
        component={Input}
        placeholder="Your full name"
        help="Your full name"
      />

      <FastField
        name="email"
        size="medium"
        label="Business Email"
        icon="at"
        component={Input}
        placeholder="Business email"
        help="Business email"
      />

      <FastField
        name="phone"
        size="medium"
        label="Phone"
        icon="phone-alt"
        component={Input}
        placeholder="Business phone number"
        help="Best phone number to reach you"
      />
      <FastField
        name="company"
        size="medium"
        label="Company"
        icon="building"
        component={Input}
        placeholder="Company"
        help="Company name, Trading as"
      />
    </Box>
  );
}
