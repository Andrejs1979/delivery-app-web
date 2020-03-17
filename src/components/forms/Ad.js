import React, { useState, useEffect } from 'react';

import { FastField, useFormikContext } from 'formik';

import AdEditor from 'components/ui/AdEditor';
// import Upload from 'components/ui/Upload';

import { Box } from 'components/ui/bulma';

export default function Ad() {
	const [ uri, setUri ] = useState('SampleLogo.png');
	const [ secureURL, setSecureURL ] = useState();
	const [ size, setSize ] = useState(0.25);
	const [ position, setPosition ] = useState();
	const [ background, setBackground ] = useState(true);
	const [ originalFileName, setOriginalFileName ] = useState();

	const { setFieldValue } = useFormikContext();

	const creative = { uri, size, position, background, originalFileName };
	const actions = { setUri, setSecureURL, setSize, setPosition, setBackground, setOriginalFileName };

	useEffect(
		() => {
			if (secureURL) {
				setFieldValue('creative', {
					uri,
					size,
					position,
					background,
					secureURL,
					originalFileName
				});
			}
		},
		[ background, originalFileName, position, secureURL, setFieldValue, size, uri ]
	);

	return (
		<Box>
			<FastField
				name="creative"
				label="Upload an artwork"
				icon="image"
				component={AdEditor}
				creative={creative}
				actions={actions}
			/>

			{/* <p className="title is-4">Preview</p>
					<p className="subtitle">Adjust how your ad looks like</p> */}
			{/* <AdEditor creative={creative} actions={actions} /> */}
			{/* <br />
					<article className="message is-dark is-small">
						<div className="message-body">If you are not happy how it looks like, talk to us!</div>
					</article> */}
		</Box>
	);
}
