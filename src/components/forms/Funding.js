import React from "react";

import { FastField } from "formik";

import { Box } from "components/ui/bulma";
import { Columns, Column } from "components/ui/bulma";
import { Input } from "components/ui/bulma";

export default function Budget() {
  return (
    <Columns>
      <Column>
        <Box>
          <FastField
            name="beneficiary"
            label="Name on the account"
            icon="dollar-sign"
            component={Input}
            placeholder="Name on the account"
            help="Account owner, a person or a company"
          />
          <FastField
            type="number"
            name="account"
            label="Account number"
            icon="dollar-sign"
            component={Input}
            placeholder="Account number"
            help="Account number"
          />

          <FastField
            type="number"
            name="routing"
            label="Routing"
            icon="hand-paper"
            component={Input}
            placeholder="Routing number"
            help="Routing number"
          />
        </Box>
      </Column>
      <Column>
        <Box>
          <article className="message is-small">
            <div className="message-body">
              <p className="title is-5">Verification required</p>
              <p className="subtitle is-6">
                Before you can get paid the first time, you will need to upload
                a picture of the void check.
              </p>
            </div>
          </article>
        </Box>
      </Column>
    </Columns>
  );
}
