import React, { useState, useEffect } from 'react';

import { FastField, useFormikContext } from 'formik';

import AdEditor from 'components/ui/AdEditor';
import Upload from 'components/ui/Upload';

import { Box } from 'components/ui/bulma/elements';
import { Columns, Column } from 'components/ui/bulma/layout';
import { Input } from 'components/ui/bulma/form';

export default function Brand() {
	const [ uri, setUri ] = useState('ihop-breakfast.png');
	const [ secureURL, setSecureURL ] = useState();
	const [ size, setSize ] = useState([ 240, 169 ]);
	const [ aspectRatio, setAspectRatio ] = useState(size[0] / size[1]);
	const [ position, setPosition ] = useState('bottomLeft');
	const [ background, setBackground ] = useState(true);
	const [ originalFileName, setOriginalFileName ] = useState();

	const { values, setFieldValue, setFieldTouched } = useFormikContext();

	let creative;

	if (values.creative.uri) {
		creative = values.creative;
	} else creative = { uri, size, aspectRatio, position, background, originalFileName };

	const actions = { setUri, setSize, setAspectRatio, setPosition, setBackground };

	useEffect(
		() => {
			setFieldValue('hashtag', values.name.replace(/\s/g, ''));
		},
		[ setFieldTouched, setFieldValue, values.name ]
	);

	useEffect(
		() => {
			if (secureURL) {
				setFieldValue('creative', {
					uri,
					size,
					aspectRatio,
					position,
					background,
					secureURL,
					originalFileName
				});
			}
		},
		[ aspectRatio, background, originalFileName, position, secureURL, setFieldValue, size, uri ]
	);

	return (
		<Columns>
			<Column size="half">
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

					<FastField
						name="creative"
						label="Upload an artwork"
						icon="image"
						size="large"
						component={Upload}
						placeholder="Upload your artwork"
						help="A logo or any other graphics to appear in the posts. Drag &amp; drop or select a file"
						actions={{
							setUri,
							setSecureURL,
							setSize,
							setAspectRatio,
							setPosition,
							setBackground,
							setOriginalFileName
						}}
					/>
				</Box>
			</Column>
			<Column>
				<Box>
					<p className="title is-4">Preview</p>
					<p className="subtitle">Adjust how your ad looks like</p>
					<AdEditor creative={creative} actions={actions} />
					<br />
					<article className="message is-dark is-small">
						<div className="message-body">If you are not happy how it looks like, talk to us!</div>
					</article>
				</Box>
			</Column>
		</Columns>
	);
}
