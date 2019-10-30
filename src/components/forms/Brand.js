import React, { useEffect } from 'react';

import { FastField, useFormikContext } from 'formik';

import { Box } from 'components/ui/bulma/elements';
import { Input } from 'components/ui/bulma/form';

export default function Brand() {
	const { values, setFieldValue, setFieldTouched } = useFormikContext();

	useEffect(
		() => {
			setFieldValue('hashtag', values.name.replace(/\s/g, ''));
		},
		[ setFieldTouched, setFieldValue, values.name ]
	);

	return (
		<Box>
			<FastField
				name="name"
				label="Brand name"
				icon="copyright"
				size="large"
				component={Input}
				placeholder="Super Coffee Place"
				help="Which brand, product or business will we promote?"
			/>

			<FastField
				name="hashtag"
				label="Hashtag"
				icon="hashtag"
				size="large"
				component={Input}
				placeholder="BestCoffee"
				help="A hashtag for your promo posts on Instagram"
			/>

			<FastField
				name="message"
				label="Promo message (optional)"
				icon="bullhorn"
				size="large"
				component={Input}
				placeholder="Best coffee in town!"
				help="A short marketing message to appear in the promo posts"
			/>
		</Box>
	);
}
