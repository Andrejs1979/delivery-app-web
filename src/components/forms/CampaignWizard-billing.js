import React, { useCallback, useContext, useState } from "react";

import { gql, useMutation } from "@apollo/client";

import { FormikWizard } from "formik-wizard";
import { object, string, array, number } from "yup";

// import Modal from 'components/ui/Modal';
import Wizard from "components/ui/Wizard";
import Brand from "components/forms/Brand";
import Ad from "components/forms/Ad";
import Locations from "components/forms/Locations";
import Budget from "components/forms/Budget";
import Billing from "components/forms/Billing";
import Summary from "components/forms/Summary";

import { Button, ButtonGroup } from "components/ui/bulma/elements";

import UserContext from "context/UserContext";

export default function CampaignWizard({ onClose }) {
  const { headers } = useContext(UserContext);
  const [spinner, setSpinner] = useState(false);

  const [createCampaign] = useMutation(CREATE_CAMPAIGN, {
    context: { headers }
  });

  const [createAd] = useMutation(CREATE_AD, {
    context: { headers }
  });

  const [createLocations] = useMutation(CREATE_LOCATIONS, {
    context: { headers }
  });

  const [createCard] = useMutation(CREATE_CARD, {
    context: { headers },
    refetchQueries: ["CurrentUser"]
  });

  const handleSubmit = useCallback(
    async ({
      brand: { name, hashtag, message },
      ad: {
        creative: { uri, size, position, background, secureURL }
      },
      locations: { locations },
      budget: { rate, limit },
      billing: {
        card: {
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
        },
        cardToken
      }
    }) => {
      setSpinner(true);

      const campaignProps = {
        name,
        hashtag,
        limit
      };

      const newLocations = locations.map(
        ({
          address_components,
          geometry: { bounds, viewport, location_type },
          formatted_address,
          lat,
          lng,
          place_id,
          types
        }) => {
          return {
            name: "",
            verified: false,
            active: false,
            category: "",
            status: "pending",
            fullAddress: formatted_address,
            address: `${address_components[0].short_name} ${address_components[1].short_name}`,
            city: address_components[2].short_name,
            state: address_components[4].short_name,
            zip: address_components[6].short_name,
            country: address_components[5].long_name,
            geometry: {
              // type: location_type,
              coordinates: [lng, lat]
              // bounds: {
              // 	north: bounds.north,
              // 	east: bounds.east,
              // 	south: bounds.south,
              // 	west: bounds.west
              // },
              // viewport: {
              // 	north: viewport.north,
              // 	east: viewport.east,
              // 	south: viewport.south,
              // 	west: viewport.west
              // }
            },
            source: "google",
            sourceID: place_id
            // types
          };
        }
      );

      const adProps = {
        creativeURI: uri,
        size,
        position,
        background,
        secureURL,
        message,
        rate: rate.toString(),
        currency: "USD",
        radius: 25,
        status: "pending"
      };

      const cardProps = {
        provider: "stripe",
        providerID,
        providerName,
        token: cardToken,

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
        method: object,
        country
      };

      const { data } = await createCampaign({ variables: { campaignProps } });
      const campaignID = data.createCampaign.id;

      await createAd({ variables: { adProps, campaignID } });
      await createLocations({
        variables: { locations: newLocations, campaignID }
      });
      await createCard({ variables: { cardProps, campaignID } });

      setSpinner(false);
    },
    [createAd, createCampaign, createCard, createLocations]
  );

  return (
    // <Modal icon="magic" title="New campaign" onClose={onClose}>
    // <Hero color="white" bold>
    <FormikWizard steps={steps} onSubmit={handleSubmit} render={FormWrapper} />
    // </Hero>
    // </Modal>
  );
}

const FormWrapper = ({
  currentStep,
  steps,
  children,
  isLastStep,
  status,
  goToPreviousStep,
  canGoBack,
  actionLabel
}) => (
  <div>
    <Wizard steps={steps} currentStep={currentStep} stepProps={stepProps} />

    {children}
    {/* {status && (
			<div>
				{status.message}
				<hr />
			</div>
		)} */}

    <ButtonGroup right>
      <Button
        size="medium"
        icon="angle-left"
        color="white"
        action={goToPreviousStep}
        disabled={!canGoBack}
      >
        Back
      </Button>
      <Button type="submit" block size="medium" icon="check-circle">
        {actionLabel || (isLastStep ? "Launch Campaign" : "Continue")}
      </Button>
    </ButtonGroup>
  </div>
);

const steps = [
  {
    id: "brand",
    component: Brand,
    icon: "copyright",
    name: "Brand",
    title: "Your brand",
    subtitle:
      "Please set a name corresponding to a brand, product or business you are promoting",
    initialValues: {
      name: "",
      hashtag: "",
      message: ""
    },
    validationSchema: object().shape({
      name: string().required("What is it we promote?"),
      hashtag: string()
        .required("Hashtag is required!")
        .min(5, "Too short")
        .max(20, "Too long"),
      message: string()
    })
    // actionLabel: 'Next: Choose location'
  },
  {
    id: "ad",
    component: Ad,
    icon: "camera",
    name: "Ad",
    title: "Your brand",
    subtitle:
      "Please set a name corresponding to a brand, product or business you are promoting",
    initialValues: {
      creative: {}
    },
    validationSchema: object().shape({
      creative: object({
        uri: string().required("Please upload your file!")
      }).required("Please upload your graphics!")
    })
    // actionLabel: 'Next: Choose location'
  },
  {
    id: "locations",
    component: Locations,
    initialValues: {
      location: "",
      locations: []
    },
    validationSchema: object().shape({
      locations: array()
        .required("Please add some locations")
        .min(1, "Min. 1 location required")
    })
    // actionLabel: 'Next'
  },
  {
    id: "budget",
    component: Budget,
    initialValues: {
      rate: "",
      limit: ""
    },
    validationSchema: object().shape({
      rate: number()
        .required("Please set your reward amount!")
        .min(1, "Minimum reward is $1")
        .max(100, "Maximum reward is $100"),
      limit: number()
        .min(1)
        .max(10000)
    }),
    // actionLabel: 'Next',
    onAction: (sectionValues, formValues) => {
      if (sectionValues.companyName === "argh!") {
        throw new Error("Please, choose a better name!");
      }
    }
  },
  {
    id: "billing",
    component: Billing,
    initialValues: {
      cardToken: "",
      card: {}
    },
    validationSchema: object().shape({
      cardToken: string().required("Please enter your card info!")
    })
    // actionLabel: 'Next',
  },
  {
    id: "summary",
    component: Summary
  }
];

const stepProps = [
  {
    id: "brand",
    icon: "ad",
    name: "Brand",
    title: "Your brand",
    subtitle: "Business or product name, a hashtag and marketing message"
  },
  {
    id: "ad",
    icon: "ad",
    name: "Ad",
    title: "Your promo post",
    subtitle: "Please upload your logo and adjust how the post will look like"
  },

  {
    id: "locations",
    icon: "map-marker-alt",
    name: "Locations",
    title: "Choose your locations",
    subtitle:
      "Please use the map seach tool to add as many locations as you want, anywhere in the world."
  },
  {
    id: "budget",
    icon: "coins",
    name: "Budget",
    title: "Set your budget",
    subtitle: "How much shall you pay for each post?"
  },
  {
    id: "billing",
    icon: "credit-card",
    name: "Billing",
    title: "Set up billing",
    subtitle: "We use your card to reward your promoters"
  },
  {
    id: "summary",
    icon: "clipboard-list",
    name: "Summary",
    title: "Campaign Summary",
    subtitle:
      "Please check if all is correct. Feel free to go back and change anything."
  }
];

const CREATE_CAMPAIGN = gql`
  mutation CreateCampaign($campaignProps: CampaignProps) {
    createCampaign(campaignProps: $campaignProps) {
      id
    }
  }
`;

const CREATE_AD = gql`
  mutation CreateAd($adProps: AdProps, $campaignID: ID!) {
    createAd(adProps: $adProps, campaignID: $campaignID) {
      id
    }
  }
`;

const CREATE_LOCATIONS = gql`
  mutation CreateLocations($locations: [LocationProps], $campaignID: ID) {
    createLocations(locations: $locations, campaignID: $campaignID) {
      id
    }
  }
`;

const CREATE_CARD = gql`
  mutation CreateCard($cardProps: CardProps) {
    createCard(cardProps: $cardProps) {
      id
    }
  }
`;
