import React from 'react';

import { useFormikWizard } from 'formik-wizard';

import { Box } from 'components/ui/bulma';
import { Columns, Column } from 'components/ui/bulma';

import { Image, Transformation } from 'cloudinary-react';

export default function Summary() {
	const { values } = useFormikWizard();

	const {
		brand: { name, hashtag, message },
		ad: { creative: { uri, size, position, background } },
		locations: { locations },
		budget: { rate, limit }
		// billing: { card }
	} = values;

	return (
		<Columns>
			<Column>
				<Box>
					<p className="title is-4">Brand</p>
					<p className="title is-5">{name}</p>
					<p className="subtitle is-6">#{hashtag}</p>
					<p className="subtitle is-5">{message ? message : 'Optional marketing message is not set'}</p>
					<hr />
					<p className="title is-4">Locations</p>
					{locations.map((location) => (
						<a key={location.formatted_address}>
							<div className="notification">
								<p className="title is-7">{location.formatted_address}</p>
							</div>
							<small />
						</a>
					))}
					<hr />
					<p className="title is-4">Budget</p>
					<p className="title is-5">${rate} per approved post </p>
					<p className="title is-5">Budget limited at ${limit}</p>
					<hr />
					{/* <p className="title is-4">Billing</p>
					<p className="title is-5">
						{card.brand} **** {card.last4}
					</p> */}
					<p className="title is-4">You recieved a $10 ad bonus</p>
				</Box>
			</Column>
			<Column>
				<Box>
					<p className="title is-4">Preview</p>
					<p className="subtitle">How it may look like on Instagram</p>
					<Image publicId="assets/example.jpg" dpr="auto" responsive width="auto" crop="scale">
						<Transformation quality="auto" />
						<Transformation
							overlay={`creative:${uri}`}
							gravity={position}
							x="10"
							y="10"
							width={size}
							flags="relative"
							// effect="screen"
						/>
					</Image>
					<br />
					<p className="subtitle is-6">
						This is a preview. We review every campaign and will make sure it looks good before going live.
					</p>
				</Box>
			</Column>
		</Columns>
	);
}
